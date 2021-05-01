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

        const {answerText} = req.body;

        let query = `
            INSERT INTO answers(answer_text, profile_id, comment_id) 
            VALUES('${answerText}', ${req.profile.id}, ${req.comment.id})
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            query = `SELECT * FROM answers WHERE profile_id=${req.profile.id} ORDER BY created_at DESC LIMIT 1`;

            db.query(query, (err: MysqlError, result) => {
                if(err) throw err;

                let answer = result[0];
                answer.username = req.user.username;

                if(req.profile.id != req.comment.profile_id){
                    query = `
                        INSERT INTO notifications(notification_type, notification, profile_id, sender_profile_id) 
                        VALUES('comment', '${req.user.username} answer on your comment', ${req.comment.profile_id}, ${req.profile.id})
                    `

                    db.query(query, (err: MysqlError) => {
                        if(err) throw err;

                        res.json(answer);
                    })
                }else{
                    res.json(answer);
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

        const {answerText} = req.body;

        req.answer.answer_text = answerText;

        const {answer_text, id} = req.answer;

        let query = `
            UPDATE answers SET answer_text='${answer_text}'
            WHERE id=${id} AND profile_id=${req.profile.id}
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Answer updated successfully!"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const remove = (req: Request, res: Response) => {
    try {
        let query = `DELETE FROM answers WHERE id=${req.answer.id} AND profile_id=${req.profile.id}`;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Answer deleted successfully!"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const like = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM answers_liked WHERE answer_id=${req.answer.id} AND profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 1){
                return res.status(400).json({error: "Answer already liked"})
            }

            query = `CALL hitLikeButton(TRUE, 'answer', ${req.answer.likes}, NULL, NULL, ${req.answer.id}, ${req.profile.id})`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;

                if(req.answer.profile_id !== req.profile.id){
                    query = `
                        SELECT id, interactions FROM notifications 
                        WHERE profile_id=${req.answer.profile_id} AND answer_id=${req.answer.id}
                    `;

                    db.query(query, (err, result) => {
                        if(err) throw err;

                        if(result.length === 0){
                            query = `SELECT id FROM answers_liked WHERE answer_id=${req.answer.id}`;

                            db.query(query, (err: MysqlError, result) => {
                                if(err) throw err;

                                const interactions = result.length;

                                let notification = "";

                                if(interactions === 1){
                                    notification = `${req.user.username} like your answer!`;
                                }else{
                                    notification = `${req.user.username} and ${interactions - 1} ${"other" + (interactions - 1 > 1 ? "s" : "")} like your answer!`
                                }

                                query = `
                                        INSERT INTO notifications(notification_type, notification, profile_id, sender_profile_id, answer_id)
                                        VALUES('like', '${notification}', ${req.answer.profile_id}, ${req.profile.id}, ${req.answer.id})
                                    `

                                db.query(query, (err) => {
                                    if(err) throw err;
    
                                    res.json({message: "Answer liked"})
                                })
                            })
                        }else{
                            let notificationObj = result[0]
                            let moreUsersStr = notificationObj.interactions === 0 ? " " : ` ${notificationObj.interactions} other` + (notificationObj.interactions > 1 ? "s " : " ")
                            let notification = `${req.user.username} and${notificationObj.interactions} ${moreUsersStr}like your answer!`

                            query = `
                                UPDATE notifications SET interactions=${notificationObj.interactions + 1}, 
                                notification='${notification}' WHERE id=${notificationObj.id}
                            `

                            db.query(query, (err) => {
                                if(err) throw err;

                                res.json({message: "Answer liked"})
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
        let query = `SELECT * FROM answers_liked WHERE answer_id=${req.answer.id} AND profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(400).json({error: "Answer isn't liked"})
            }

            query = `CALL hitLikeButton(FALSE, 'answer', ${req.answer.likes}, NULL, NULL, ${req.answer.id}, ${req.profile.id})`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;

                if(req.answer.profile_id !== req.profile.id){
                    query = `SELECT id, interactions FROM notifications WHERE profile_id=${req.answer.profile_id} AND answer_id=${req.answer.id}`

                    db.query(query, (err,result) => {
                        if(err) throw err;

                        if(result.length === 0){
                            return res.status(404).json({error: "Notification not found"})
                        }
                        
                        let notification = result[0];

                        query = `UPDATE notifications SET interactions=${notification.interactions - 1} WHERE id=${notification.id}`

                        db.query(query, (err) => {
                            if(err) throw err;

                            res.json({message: "Answer unliked"})
                        })
                    })
                }else{
                    res.json({message: "Answer unliked"})
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}