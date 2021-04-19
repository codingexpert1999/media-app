import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import db from '../config/db';
import {validationResult} from 'express-validator';
import { Friendship } from '../interfaces';
import { getAsyncMysqlResult } from '../helper';

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
        const receiverProfileId = parseInt(req.params.receiverProfileId)

        let query = `SELECT * FROM friend_requests WHERE sender_profile_id=${req.profile.id} AND receiver_profile_id=${receiverProfileId}`;

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
                    INSERT INTO friend_requests(sender_profile_id, receiver_profile_id) VALUES(${req.profile.id}, ${receiverProfileId})
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
        const senderProfileId = parseInt(req.params.senderProfileId)

        let query = `SELECT * FROM friend_requests WHERE sender_profile_id=${senderProfileId} AND receiver_profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Friend request not found!"})
            }

            query = `CALL acceptFriendRequest(${senderProfileId}, ${req.profile.id}, '${req.user.username}')`;

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

export const cancelFriendRequest = (req: Request, res: Response) => {
    try {
        const receiverProfileId = parseInt(req.params.receiverProfileId);

        let query = `DELETE FROM friend_requests WHERE sender_profile_id=${req.profile.id} AND receiver_profile_id=${receiverProfileId}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Request deleted successfully"})
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
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

export const getSendedFriendRequests = (req: Request, res: Response) => {
    try {
        console.log(req.profile.id)
        let query = `SELECT id, receiver_profile_id FROM friend_requests WHERE sender_profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            console.log(result)

            res.json(result);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getFriends = (req: Request, res: Response) => {
    try {
        let query = `
            SELECT f.id, f.my_profile_id, f.friend_profile_id, u.username FROM friends AS f 
            INNER JOIN profiles AS p ON (f.my_profile_id=p.id OR f.friend_profile_id=p.id)
            INNER JOIN users AS u ON u.id=p.user_id
            WHERE (f.my_profile_id=${req.profile.id} OR f.friend_profile_id=${req.profile.id}) AND username!='${req.user.username}'
        `;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            let friends = result.map((friendship: Friendship) => {
                let friend_profile_id: number;

                if(friendship.my_profile_id === req.profile.id){
                    friend_profile_id = friendship.friend_profile_id
                }else{
                    friend_profile_id = friendship.my_profile_id;
                }

                return {id: friendship.id, friend_profile_id, username: friendship.username};
            })

            res.json(friends);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }
}

export const fetchCurrentProfile = (req: Request, res: Response) => {
    try {
        if(req.session.profile!.id + "" === req.params.currentProfile){
            let profile = {
                id: req.session.profile!.id,
                profile_image: req.session.profile!.profile_image,
                profile_description: req.session.profile!.profile_description,
                friends: req.session.profile!.friends,
                posts: req.session.profile!.posts,
                status: req.session.profile!.status
            }
            return res.json({profile});
        }

        let profileId = parseInt(req.params.currentProfile);

        let query = `SELECT id, profile_image, profile_description, friends, posts, status FROM profiles WHERE id=${profileId}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            res.json({profile: result[0]});
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message});
    }
}

export const fetchProfilePosts =(req: Request, res: Response) => {
    try {
        let profileId = parseInt(req.params.currentProfile);

        if(req.session.profile!.id === profileId && req.session.posts && req.session.postsChanged === false){
            return res.json(req.session.posts);
        }

        let query = `
            SELECT p.id, p.post_text, p.post_image, p.post_video, p.likes, p.created_at, u.username FROM posts as p 
            INNER JOIN profiles as prof ON prof.id=p.profile_id INNER JOIN users as u ON u.id=prof.user_id
            WHERE p.profile_id=${profileId} ORDER BY p.created_at DESC LIMIT 0, 10
        `;

        db.query(query, async (err: MysqlError, result) => {
            if(err) throw err;

            let posts = result;

            for(let i = 0; i < posts.length; i++){
                query = `
                SELECT c.id, c.comment_text, c.likes, c.created_at, c.profile_id, u.username FROM comments as c 
                INNER JOIN profiles as p ON c.profile_id=p.id INNER JOIN users as u ON u.id=p.user_id
                WHERE c.post_id=${posts[i].id} ORDER BY c.created_at DESC LIMIT 0, 3
                `;

                posts[i].comments = await getAsyncMysqlResult(query);

                for(let j = 0; j < posts[i].comments.length; j++){
                    query = `
                        SELECT a.id, a.answer_text, a.likes, a.created_at, a.profile_id, u.username FROM answers as a 
                        INNER JOIN profiles as p ON a.profile_id=p.id INNER JOIN users as u ON u.id=p.user_id
                        WHERE a.comment_id=${posts[i].comments[j].id} ORDER BY a.created_at DESC LIMIT 0, 3
                    `;

                    posts[i].comments[j].answers = await getAsyncMysqlResult(query);
                }
            }

            if(req.session.profile!.id === profileId){
                req.session.posts = posts;
                req.session.postsChanged = false;
            }

            res.json(posts);
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message});
    }
}

export const updateProfileDescription = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(404).json({errors: errors.array()});
        }

        const {description} = req.body;

        let query = `UPDATE profiles SET profile_description='${description}' WHERE id=${req.profile.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            req.profile.profile_description = description;
            req.session.profile = req.profile;

            res.json({message: "Description updated successfully!"})
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

export const findProfileUsernameMatches = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {firstLetter} = req.body;

        let query = `SELECT username FROM users WHERE username LIKE '${firstLetter}%' LIMIT 20`

        db.query(query, (err:MysqlError, result) => {
            if(err) throw err;

            res.json(result);
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message});
    }
}

export const getSearchResults = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {username} = req.body;

        let query = `
            SELECT u.username, p.id AS profile_id, p.profile_image FROM users AS u 
            INNER JOIN profiles AS p ON u.id=p.user_id WHERE username='${username}'
        `;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            let user = result[0];

            query = `
                SELECT u.username, p.id AS profile_id, p.profile_image FROM users AS u 
                INNER JOIN profiles AS p ON u.id=p.user_id 
                WHERE username!='${username}' AND username!='${req.user.username}' AND username LIKE '${username[0]}%' LIMIT 10
            `;

            db.query(query, (err:MysqlError, result) => {
                if(err) throw err;

                if(user){
                    result.unshift(user)
                }

                res.json(result);
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const removeFriend = (req: Request, res: Response) => {
    try {
        const friendshipId = parseInt(req.params.friendshipId);

        let query = `DELETE FROM friends WHERE id=${friendshipId}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Friend deleted successfully!"});
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}