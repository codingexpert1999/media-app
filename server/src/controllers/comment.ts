import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../config/db';

export const create = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {commentText} = req.body;

        let query = `
            INSERT INTO comments(comment_text, profile_id, post_id) 
            VALUES('${commentText}', ${req.profile.id}, ${req.post.id})
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            query = `SELECT * FROM comments WHERE profile_id=${req.profile.id} ORDER BY created_at DESC LIMIT 1`;

            db.query(query, (err: MysqlError, result) => {
                if(err) throw err;

                let comment = result[0];
                comment.answers = [];
                comment.username = req.user.username;

                if(req.profile.id != req.post.profile_id){
                    query = `
                        INSERT INTO notifications(notification_type, notification, profile_id, sender_profile_id) 
                        VALUES('comment', '${req.user.username} comment on your post', ${req.post.profile_id}, ${req.profile.id})
                    `

                    db.query(query, (err: MysqlError) => {
                        if(err) throw err;

                        res.json(comment);
                    })
                }else{
                    res.json(comment);
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const update = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {commentText} = req.body;

        req.comment.comment_text = commentText;

        const {comment_text, id} = req.comment;

        let query = `
            UPDATE comments SET comment_text='${comment_text}'
            WHERE id=${id} AND profile_id=${req.profile.id}
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Comment updated successfully!"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const remove = (req: Request, res: Response) => {
    try {
        let query = `DELETE FROM comments WHERE id=${req.comment.id} AND profile_id=${req.profile.id}`;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Comment deleted successfully!"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const like = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM comments_liked WHERE comment_id=${req.comment.id} AND profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 1){
                return res.status(400).json({error: "Comment already liked"});
            }

            query = `CALL hitLikeButton(TRUE, 'comment', ${req.comment.likes}, NULL, ${req.comment.id}, NULL, ${req.profile.id})`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;
    
                if(req.comment.profile_id !== req.profile.id){
                    query = `
                        SELECT id, interactions FROM notifications 
                        WHERE profile_id=${req.comment.profile_id} AND comment_id=${req.comment.id}
                    `;

                    db.query(query, (err, result) => {
                        if(err) throw err;

                        if(result.length === 0){
                            query = `SELECT id FROM comments_liked WHERE comment_id=${req.comment.id}`;

                            db.query(query, (err: MysqlError, result) => {
                                if(err) throw err;

                                const interactions = result.length;

                                let notification = "";

                                if(interactions === 1){
                                    notification = `${req.user.username} like your comment!`;
                                }else{
                                    notification = `${req.user.username} and ${interactions - 1} ${"other" + (interactions - 1 > 1 ? "s" : "")} like your comment!`
                                }

                                query = `
                                        INSERT INTO notifications(notification_type, notification, profile_id, sender_profile_id, comment_id)
                                        VALUES('like', '${notification}', ${req.comment.profile_id}, ${req.profile.id}, ${req.comment.id})
                                    `

                                db.query(query, (err) => {
                                    if(err) throw err;
    
                                    res.json({message: "Comment liked"})
                                })
                            })
                        }else{
                            let notificationObj = result[0]
                            let moreUsersStr = notificationObj.interactions === 0 ? " " : ` ${notificationObj.interactions} other` + (notificationObj.interactions > 1 ? "s " : " ")
                            let notification = `${req.user.username} and${notificationObj.interactions} ${moreUsersStr}like your comment!`

                            query = `
                                UPDATE notifications SET interactions=${notificationObj.interactions + 1}, 
                                notification='${notification}', seen=FALSE WHERE id=${notificationObj.id}
                            `

                            db.query(query, (err) => {
                                if(err) throw err;

                                res.json({message: "Comment liked"})
                            })
                        }
                    })
                }else{
                    res.json({message: "Comment liked"})
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const unlike = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM comments_liked WHERE comment_id=${req.comment.id} AND profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(400).json({error: "Comment isn't liked"});
            }

            query = `CALL hitLikeButton(FALSE, 'comment', ${req.comment.likes}, NULL, ${req.comment.id}, NULL, ${req.profile.id})`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;
    
                if(req.comment.profile_id !== req.profile.id){
                    query = `SELECT id, interactions FROM notifications WHERE profile_id=${req.comment.profile_id} AND comment_id=${req.comment.id}`

                    db.query(query, (err,result) => {
                        if(err) throw err;

                        if(result.length === 0){
                            return res.status(404).json({error: "Notification not found"})
                        }
                        
                        let notification = result[0];

                        query = `UPDATE notifications SET interactions=${notification.interactions - 1} WHERE id=${notification.id}`

                        db.query(query, (err) => {
                            if(err) throw err;

                            res.json({message: "Comment unliked"})
                        })
                    })
                }else{
                    res.json({message: "Comment unliked"})
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}