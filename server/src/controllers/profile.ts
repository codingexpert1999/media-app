import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import db from '../config/db';
import {validationResult} from 'express-validator';
import { Friend, Notification } from '../interfaces';
import { getAsyncMysqlResult } from '../helper';
import redisClient from '../config/redis'

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

                    query = `
                        INSERT INTO notifications(notification_type, notification, profile_id, sender_profile_id) 
                        VALUES('friend_request', '${req.user.username} send you a friend request!', ${receiverProfileId}, ${req.profile.id})
                    `

                    db.query(query, (err: MysqlError) => {
                        if(err) throw err;

                        res.json({message: "Request sended successfully!"});
                    })
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

                query = `
                    INSERT INTO conversations(profile_1_id, profile_2_id) 
                    VALUES(${req.profile.id}, ${senderProfileId})
                `
                db.query(query, (err: MysqlError) => {
                    if(err) throw err;

                    redisClient.setex(`${req.profile.id}-friends-changed`, 3600 * 2, 'true');
                    redisClient.setex(`${senderProfileId}-friends-changed`, 3600 * 2, 'true');

                    res.json({message: `You have accepted the friend request from profile with ID=${senderProfileId}`});
                })
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

            query = `DELETE FROM notifications WHERE profile_id=${receiverProfileId} 
            AND sender_profile_id=${req.profile.id} AND notifications_type='friend_request'`

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
            SELECT n.id, n.notification_type, n.notification, n.sender_profile_id, n.seen, n.created_at, p.profile_image
            FROM notifications AS n INNER JOIN profiles AS p ON p.id=n.sender_profile_id
            WHERE n.profile_id=${req.profile.id} ORDER BY created_at DESC
        `;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            let notifications = result.filter((notification: Notification) => notification.seen === 0);
            redisClient.setex(req.profile.id + "-notifications", 3600 * 2, JSON.stringify(notifications));

            res.json(result)
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getNewNotifications = (req: Request, res: Response) => {
    // LONG POLLING
    try {
        let count = 0;

        redisClient.get(`${req.profile.id}-notifReqCount`, (err, reply) => {
            if(reply){
                count = parseInt(reply);
            }

            count++;

            if(count === 10){
                count = 0;
                redisClient.setex(`${req.profile.id}-notifReqCount`, 3600, JSON.stringify(count));
                return res.json({message: "No data. Request ended"})
            }

            redisClient.setex(`${req.profile.id}-notifReqCount`, 3600, JSON.stringify(count));

            let query = `
                SELECT n.id, n.notification_type, n.notification, n.sender_profile_id, n.seen, n.created_at, p.profile_image
                FROM notifications AS n INNER JOIN profiles AS p ON p.id=n.sender_profile_id
                WHERE n.seen=0 AND n.profile_id=${req.profile.id} ORDER BY created_at ASC
            `;

            db.query(query, (err: MysqlError, result) => {
                if(err) throw err;

                if(result.length > 0){
                    redisClient.get(req.profile.id + "-notifications", (err, reply) => {
                        if(err) throw err;

                        if(!reply){
                            redisClient.setex(req.profile.id + "-notifications", 3600 * 2, JSON.stringify(result));
                            count = 0;
                            return res.json(result)
                        }else{
                            let notifications = [];
                            let prevNotifications: Notification[] = reply ? JSON.parse(reply) : [];
            
                            for(let i = 0; i < result.length; i++){
                                let notif = prevNotifications.find(notification => notification.id === result[i].id);
            
                                if(!notif){
                                    notifications.push(result[i])
                                }else{
                                    if(notif.notification !== result[i].notification){
                                        notifications.push(result[i])
                                    }
                                }
                            }
            
                            if(notifications.length > 0){
                                redisClient.setex(req.profile.id + "-notifications", 3600 * 2, JSON.stringify([...notifications, ...prevNotifications]));
                                count = 0;
                                return res.json(notifications)
                            }else{
                                setTimeout(() => { getNewNotifications(req, res) }, 5000);
                            }
                        }
                    })
                }else{
                    setTimeout(() => { getNewNotifications(req, res) }, 5000);
                }
            })
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
        let query = `SELECT id, receiver_profile_id FROM friend_requests WHERE sender_profile_id=${req.profile.id}`;

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
        redisClient.get(`${req.profile.id}-friends-changed`, (err, reply) => {
            if(err) throw err;

            if(reply){
                let query = `
                    SELECT f.id, IF(f.friend_profile_id=${req.profile.id}, f.my_profile_id, f.friend_profile_id) as friend_profile_id, 
                    p.is_active, u.username FROM friends AS f 
                    INNER JOIN profiles AS p ON (f.my_profile_id=p.id OR f.friend_profile_id=p.id)
                    INNER JOIN users AS u ON u.id=p.user_id
                    WHERE (f.my_profile_id=${req.profile.id} OR f.friend_profile_id=${req.profile.id}) AND username!='${req.user.username}'
                `;
        
                db.query(query, (err: MysqlError, result) => {
                    if(err) throw err;

                    redisClient.setex(`${req.profile.id}-friends`, 3600 * 2, JSON.stringify(result));
                    redisClient.del(`${req.profile.id}-friends-changed`);
        
                    res.json(result);
                })
            }else{
                redisClient.get(`${req.profile.id}-friends`, (err, reply) => {
                    if(err) throw err;

                    if(reply){
                        return res.json(JSON.parse(reply))
                    }else{
                        let query = `
                            SELECT f.id, IF(f.friend_profile_id=${req.profile.id}, f.my_profile_id, f.friend_profile_id) as friend_profile_id, 
                            p.is_active, u.username FROM friends AS f 
                            INNER JOIN profiles AS p ON (f.my_profile_id=p.id OR f.friend_profile_id=p.id)
                            INNER JOIN users AS u ON u.id=p.user_id
                            WHERE (f.my_profile_id=${req.profile.id} OR f.friend_profile_id=${req.profile.id}) AND username!='${req.user.username}'
                        `;
                
                        db.query(query, (err: MysqlError, result) => {
                            if(err) throw err;
        
                            redisClient.setex(`${req.profile.id}-friends`, 3600 * 2, JSON.stringify(result));
                
                            res.json(result);
                        })
                    }
                })
            }
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

        let query = `SELECT username FROM users WHERE username!='${req.user.username}' AND username LIKE '${firstLetter}%' LIMIT 20`

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

        let query = `SELECT my_profile_id, friend_profile_id FROM friends WHERE id=${friendshipId}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Friendship not found"});
            }

            let otherProfileId = result.my_profile_id === req.profile.id ? result.friend_profile_id : result.my_profile_id;

            query = `DELETE FROM friends WHERE id=${friendshipId}`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;

                query = `
                    DELETE FROM conversations WHERE 
                    (profile_1_id=${req.profile.id} AND profile_2_id=${otherProfileId}) OR
                    (profile_1_id=${otherProfileId} AND profile_2_id=${req.profile.id})
                `

                db.query(query, (err: MysqlError) => {
                    if(err) throw err;

                    redisClient.setex(`${req.profile.id}-friends-changed`, 3600 * 2, 'true');
                    redisClient.setex(`${otherProfileId}-friends-changed`, 3600 * 2, 'true');

                    res.json({message: "Friend deleted successfully!"});
                })
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

export const readNotifications = (req: Request, res: Response) => {
    try {
        let query = `UPDATE notifications SET seen=TRUE WHERE profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            if(redisClient.get(req.user.id + "-notifications")){
                redisClient.del(req.user.id + "-notifications")
            }

            res.json({message: "All your notifications are set to seen!"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const deleteNotification = (req: Request, res: Response) => {
    try {
        const notificationId = parseInt(req.params.notificationId);

        let query = `DELETE FROM notifications WHERE id=${notificationId}`;

        db.query(query, (err) => {
            if(err) throw err;

            res.json({message: "Notification deleted successfully!"});
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }
}

export const changeActivity = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {isActive} = req.body;

        let query = `UPDATE profiles SET is_active=${isActive} WHERE id=${req.profile.id}`;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "User activity changed successfully"});
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const checkFriendsActivity = (req: Request, res: Response) => {
    try {
        redisClient.get(`${req.profile.id}-friendsReqCount`, (err, reply) => {
            if(err) throw err;

            let friendsReqCount = 0;

            if(reply){
                friendsReqCount = parseInt(reply)
            }

            friendsReqCount++;

            if(friendsReqCount === 10){
                friendsReqCount = 0;
                redisClient.setex(`${req.profile.id}-friendsReqCount`, 3600, JSON.stringify(friendsReqCount));
                return res.json({message: "No change detected."})
            }

            redisClient.setex(`${req.profile.id}-friendsReqCount`, 3600, JSON.stringify(friendsReqCount));

            redisClient.get(`${req.profile.id}-friends`, (err, reply) => {
                if(err) throw err;
    
                if(reply){
                    let friends = JSON.parse(reply + "") as Friend[];
    
                    let query = `
                        SELECT f.id, IF(f.friend_profile_id=${req.profile.id}, f.my_profile_id, f.friend_profile_id) as friend_profile_id, 
                        p.is_active, u.username FROM friends AS f 
                        INNER JOIN profiles AS p ON (f.my_profile_id=p.id OR f.friend_profile_id=p.id)
                        INNER JOIN users AS u ON u.id=p.user_id
                        WHERE (f.my_profile_id=${req.profile.id} OR f.friend_profile_id=${req.profile.id}) AND username!='${req.user.username}'
                    `;
            
                    db.query(query, (err: MysqlError, result) => {
                        if(err) throw err;

                        let changes = []
    
                        for(let i = 0; i < result.length; i++){
                            if(result[i].is_active !== friends[i].is_active){
                                changes.push({index: i, is_active: result[i].is_active})
                            }
                        }

                        if(changes.length > 0){
                            redisClient.setex(`${req.profile.id}-friends`, 3600 * 2, JSON.stringify(result));
    
                            return res.json(changes);
                        }else{
                            setTimeout(() => { checkFriendsActivity(req, res) }, 10000);
                        }
                    })
                }else{
                    let query = `
                        SELECT f.id, IF(f.friend_profile_id=${req.profile.id}, f.my_profile_id, f.friend_profile_id) as friend_profile_id, 
                        p.is_active, u.username FROM friends AS f 
                        INNER JOIN profiles AS p ON (f.my_profile_id=p.id OR f.friend_profile_id=p.id)
                        INNER JOIN users AS u ON u.id=p.user_id
                        WHERE (f.my_profile_id=${req.profile.id} OR f.friend_profile_id=${req.profile.id}) AND username!='${req.user.username}'
                    `;
            
                    db.query(query, (err: MysqlError, result) => {
                        if(err) throw err;
    
                        redisClient.setex(`${req.profile.id}-friends`, 3600 * 2, JSON.stringify(result));
    
                        setTimeout(() => { checkFriendsActivity(req, res) }, 10000);
                    })
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}