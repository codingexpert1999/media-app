import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import db from '../config/db';
import {validationResult} from 'express-validator';
import { Friendship } from '../interfaces';

export const fetch = (req: Request, res: Response) => {
    try {
        let query = `SELECT id, profile_description, profile_image, status, friends, posts FROM profiles WHERE user_id=${req.user.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Profile not found!"});
            }

            res.json(result[0]);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const sendFriendRequest = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({errors: errors.array()});
        }

        const {receiverProfileId} = req.body;

        let profileId = req.params.profileId;

        let query = `SELECT * FROM friend_requests WHERE sender_profile_id=${profileId} AND receiver_profile_id=${receiverProfileId}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length > 0){
                return res.status(400).json({error: "Request already sent!"});
            }

            query = `SELECT * FROM profiles WHERE id=${receiverProfileId}`;

            db.query(query, (err: MysqlError, result) => {
                if(err) throw err;

                if(result.length === 0){
                    return res.status(404).json({error: "Profile not found"});
                }

                query = `
                    INSERT INTO friend_requests(sender_profile_id, receiver_profile_id) VALUES(${profileId}, ${receiverProfileId})
                `;

                db.query(query, (err: MysqlError) => {
                    if(err) throw err;

                    res.json({message: "Request sended successfully!"});
                })
            }) 
        })
 
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const acceptFriendRequest = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({errors: errors.array()});
        }

        const {senderProfileId} = req.body;

        let receiverProfileId = req.params.profileId;

        let query = `SELECT * FROM friend_requests WHERE sender_profile_id=${senderProfileId} AND receiver_profile_id=${receiverProfileId}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Friend request not found!"})
            }

            query = `CALL acceptFriendRequest(${senderProfileId}, ${receiverProfileId}, '${req.user.username}')`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;

                res.json({message: `You have accepted the friend request from profile with ID=${senderProfileId}`});
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getNotifications = (req: Request, res: Response) => {
    try {
        let query = `
            SELECT id, notification_type, notification, sender_profile_id, created_at 
            FROM notifications WHERE profile_id=${req.profile.id}
        `;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            res.json(result);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getFriendRequests = (req: Request, res: Response) => {
    try {
        let query = `SELECT id, sender_profile_id FROM friend_requests WHERE receiver_profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            res.json(result);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getFriends = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM friends WHERE my_profile_id=${req.profile.id} OR friend_profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            let friends = result.map((friendship: Friendship) => {
                let friend_profile_id: number;

                if(friendship.my_profile_id === req.profile.id){
                    friend_profile_id = friendship.friend_profile_id
                }else{
                    friend_profile_id = friendship.my_profile_id;
                }

                return {id: friendship.id, friend_profile_id}
            })

            res.json(friends);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }
}