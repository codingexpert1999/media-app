import { Request, Response } from 'express';
import { MysqlError } from 'mysql';
import db from '../config/db';
import redisClient from '../config/redis';
import { getAsyncMysqlResult } from '../helper';
import {Convo, Message} from '../interfaces'

export const getConversation = (req: Request, res: Response) => {
    try {
        let friendId = parseInt(req.params.friendId);

        let query = `
            SELECT id FROM conversations
            WHERE (profile_1_id=${req.profile.id} AND profile_2_id=${friendId}) OR 
            (profile_1_id=${friendId} AND profile_2_id=${req.profile.id})
        `

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Conversation not found"})
            }

            res.json({id: result[0].id, friendId, isActive: result[0].is_active});
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const readMessages = (req: Request, res: Response) => {
    try {
        let query = `
            UPDATE messages SET seen=FALSE 
            WHERE conversation_id=${req.conversation.id} AND profile_id!=${req.profile.id} AND seen IS FALSE
        `;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({mesage: "You have read the unseen messages"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getConversationMessages = (req: Request, res: Response) => {
    try {
        let starting = req.query.starting ? parseInt(req.query.starting + "") : 0;

        redisClient.get(`${req.conversation.id}-messages`, (err, reply) => {
            if(err) throw err;

            if(reply){
                let messages = JSON.parse(reply) as Message[];

                if(starting >= messages.length){
                    let query = `
                        SELECT id, message, seen, is_icon, created_at, profile_id FROM messages
                        WHERE conversation_id=${req.conversation.id} ORDER BY created_at DESC LIMIT ${starting}, 100
                    `
            
                    db.query(query, (err: MysqlError, result) => {
                        if(err) throw err;

                        if(result.length === 0){
                            return res.json([])
                        }

                        messages = [...messages, ...result]

                        redisClient.setex(`${req.conversation.id}-messages`, 3600 * 2, JSON.stringify(messages));

                        let ending = result.length - (starting + 15) >= 0 ? starting + 15 : (starting + 15) - (starting + 15 - result.length);

                        let messagesToSend = messages.slice(starting, ending);

                        res.json(messagesToSend);
                    })
                }else{
                    let ending = messages.length - (starting + 15) >= 0 ? starting + 15 : (starting + 15) - (starting + 15 - messages.length);

                    let messagesToSend = messages.slice(starting, ending);

                    res.json(messagesToSend);
                }
            }else{
                let query = `
                    SELECT id, message, seen, is_icon, created_at, profile_id FROM messages
                    WHERE conversation_id=${req.conversation.id} ORDER BY created_at DESC LIMIT 0, ${(starting / 15) * 100 + 100}
                `
        
                db.query(query, (err: MysqlError, result) => {
                    if(err) throw err;

                    redisClient.setex(`${req.conversation.id}-messages`, 3600 * 2, JSON.stringify(result));

                    let ending = result.length - (starting + 15) >= 0 ? starting + 15 : (starting + 15) - (starting + 15 - result.length);

                    let messagesToSend = result.slice(starting, ending);

                    res.json(messagesToSend);
                })
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getConversations = (req: Request, res: Response) => {
    try {
        redisClient.get(req.profile.id + "-convos-changed", (err, reply) => {
            if(err) throw err;

            if(reply){
                let query = `
                    SELECT id, profile_1_id, profile_2_id FROM conversations 
                    WHERE profile_1_id=${req.profile.id} OR profile_2_id=${req.profile.id}
                `

                db.query(query, async (err: MysqlError, result) => {
                    if(err) throw err;

                    if(result.length === 0){
                        return res.json([])
                    }

                    for(let i = 0; i < result.length; i++){
                        if(result[i].profile_1_id === req.profile.id){
                            result[i].friendProfileId = result[i].profile_2_id
                        }else{
                            result[i].friendProfileId = result[i].profile_1_id
                        }

                        result[i].profile_1_id = undefined
                        result[i].profile_2_id = undefined

                        query = `
                            SELECT id, message, seen, created_at, is_icon, profile_id 
                            FROM messages WHERE conversation_id=${result[i].id} ORDER BY created_at DESC
                        `

                        let lastMessage = await getAsyncMysqlResult(query) as Object[] | undefined;

                        result[i].lastMessage = lastMessage && lastMessage.length > 0 ? lastMessage[0] : undefined;
                    }

                    let conversations = result.filter((convo: Convo) => convo.lastMessage !== undefined) ?? []

                    redisClient.del(req.profile.id + "-convos-changed");
                    redisClient.setex(req.profile.id + "-conversations", 3600 * 2, JSON.stringify(conversations));

                    res.json(conversations)
                })
            }else{
                redisClient.get(req.profile.id + "-conversations", (err, reply) => {
                    if(err) throw err;
        
                    if(reply){
                        let conversations = JSON.parse(reply + "")
        
                        res.json(conversations);
                    }else{
                        let query = `
                            SELECT id, profile_1_id, profile_2_id FROM conversations 
                            WHERE profile_1_id=${req.profile.id} OR profile_2_id=${req.profile.id}
                        `
        
                        db.query(query, async (err: MysqlError, result) => {
                            if(err) throw err;
        
                            if(result.length === 0){
                                return res.json([])
                            }
        
                            for(let i = 0; i < result.length; i++){
                                if(result[i].profile_1_id === req.profile.id){
                                    result[i].friendProfileId = result[i].profile_2_id
                                }else{
                                    result[i].friendProfileId = result[i].profile_1_id
                                }
        
                                result[i].profile_1_id = undefined
                                result[i].profile_2_id = undefined
        
                                query = `
                                    SELECT id, message, seen, created_at, is_icon, profile_id 
                                    FROM messages WHERE conversation_id=${result[i].id} ORDER BY created_at DESC
                                `
        
                                let lastMessage = await getAsyncMysqlResult(query) as Object[] | undefined;
        
                                result[i].lastMessage = lastMessage && lastMessage.length > 0 ? lastMessage[0] : undefined;
                            }
        
                            let conversations = result.filter((convo: Convo) => convo.lastMessage !== undefined) ?? []
        
                            redisClient.setex(req.profile.id + "-conversations", 3600 * 2, JSON.stringify(conversations));
        
                            res.json(conversations)
                        })
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message});
    }
}