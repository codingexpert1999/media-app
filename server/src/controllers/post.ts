import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import db from '../config/db';
import { getAsyncMysqlResult } from '../helper';

export const fetch = (req: Request, res: Response) => {
    try {
        let query = `
            SELECT DISTINCT(p.id), p.post_text, p.post_image, p.post_video, p.likes, p.created_at, p.profile_id, u.username FROM posts as p 
            LEFT JOIN friends as f ON f.my_profile_id=${req.profile.id} OR f.friend_profile_id=${req.profile.id}
            INNER JOIN profiles as prof ON prof.id=p.profile_id 
            INNER JOIN users as u ON u.id=prof.user_id
            WHERE p.profile_id=${req.profile.id} OR (p.profile_id=f.friend_profile_id AND f.friend_profile_id!=${req.profile.id}) 
            OR (p.profile_id=f.my_profile_id AND f.my_profile_id!=${req.profile.id}) ORDER BY p.created_at DESC LIMIT 0, 10;
        `;

        
        db.query(query, async (err:MysqlError, result) => {
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
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const create = (req: Request, res: Response) => {
    try {
        const {postText, postImage, postVideo} = req.body;

        if(!postText && !postImage && !postVideo){
            return res.status(400).json({error: "Text, image or video is required"})
        }

        let query = `
            INSERT INTO posts(post_text, post_image, post_video, profile_id) 
            VALUES('${postText ?? ''}', '${postImage ?? ''}', '${postVideo ?? ''}', ${req.profile.id})
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            query = `SELECT * FROM posts WHERE profile_id=${req.profile.id} ORDER BY created_at DESC LIMIT 1`;

            db.query(query, (err:MysqlError, result) => {
                if(err) throw err;

                let post = result[0];
                post.comments = []
                post.username = req.user.username;

                res.json(post);
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const update = (req: Request, res: Response) => {
    try {
        const {postText, postImage, postVideo} = req.body;

        if(!postText && !postImage && !postVideo){
            return res.status(400).json({error: "Text, image or video is required"})
        }

        req.post.post_text = postText;
        req.post.post_image = postImage;
        req.post.post_video = postVideo;

        const {post_text, post_image, post_video, id} = req.post;

        let query = `
            UPDATE posts SET post_text='${post_text ?? ''}', post_image='${post_image ?? ''}', post_video='${post_video ?? ''}'
            WHERE id=${id} AND profile_id=${req.profile.id}
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Post updated successfully!"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const remove = (req: Request, res: Response) => {
    try {
        let query = `DELETE FROM posts WHERE id=${req.post.id} AND profile_id=${req.post.profile_id}`;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Post deleted successfully!"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const like = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM posts_liked WHERE post_id=${req.post.id} AND profile_id=${req.profile.id}`;
        
        db.query(query, (err:MysqlError, result) => {
            if(err) throw err;

            if(result.length === 1){
                return res.status(400).json({error: "Post already liked"});
            }

            query = `CALL hitLikeButton(TRUE, 'post', ${req.post.likes}, ${req.post.id}, NULL, NULL, ${req.profile.id})`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;

                if(req.post.profile_id !== req.profile.id){
                    query = `
                        SELECT id, interactions FROM notifications 
                        WHERE profile_id=${req.post.profile_id} AND post_id=${req.post.id}
                    `;

                    db.query(query, (err, result) => {
                        if(err) throw err;

                        if(result.length === 0){
                            query = `SELECT id FROM posts_liked WHERE post_id=${req.post.id}`;

                            db.query(query, (err: MysqlError, result) => {
                                if(err) throw err;

                                const interactions = result.length;

                                let notification = "";

                                if(interactions === 1){
                                    notification = `${req.user.username} like your post!`;
                                }else{
                                    notification = `${req.user.username} and ${interactions - 1} ${"other" + (interactions - 1 > 1 ? "s" : "")} like your post!`
                                }

                                query = `
                                        INSERT INTO notifications(notification_type, notification, profile_id, sender_profile_id, post_id)
                                        VALUES('like', '${notification}', ${req.post.profile_id}, ${req.profile.id}, ${req.post.id})
                                    `

                                db.query(query, (err) => {
                                    if(err) throw err;
    
                                    res.json({message: "Post liked"})
                                })
                            })
                        }else{
                            let notificationObj = result[0]
                            let moreUsersStr = notificationObj.interactions === 0 ? " " : ` ${notificationObj.interactions} other` + (notificationObj.interactions > 1 ? "s " : " ")
                            let notification = `${req.user.username} and${notificationObj.interactions} ${moreUsersStr}like your post!`

                            query = `
                                UPDATE notifications SET interactions=${notificationObj.interactions + 1}, 
                                notification='${notification}' WHERE id=${notificationObj.id}
                            `

                            db.query(query, (err) => {
                                if(err) throw err;

                                res.json({message: "Post liked"})
                            })
                        }
                    })
                }else{
                    res.json({message: "Post liked"})
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
        let query = `SELECT * FROM posts_liked WHERE post_id=${req.post.id} AND profile_id=${req.profile.id}`;
        
        db.query(query, (err:MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(400).json({error: "Post isn't liked"});
            }

            query = `CALL hitLikeButton(FALSE, 'post', ${req.post.likes}, ${req.post.id}, NULL, NULL, ${req.profile.id})`;

            db.query(query, (err: MysqlError) => {
                if(err) throw err;

                if(req.post.profile_id !== req.profile.id){
                    query = `SELECT id, interactions FROM notifications WHERE profile_id=${req.post.profile_id} AND post_id=${req.post.id}`

                    db.query(query, (err,result) => {
                        if(err) throw err;

                        if(result.length === 0){
                            return res.status(404).json({error: "Notification not found"})
                        }
                        
                        let notification = result[0];

                        query = `UPDATE notifications SET interactions=${notification.interactions - 1} WHERE id=${notification.id}`

                        db.query(query, (err) => {
                            if(err) throw err;

                            res.json({message: "Post unliked"})
                        })
                    })
                }else{
                    res.json({message: "Post unliked"})
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const getAllLikes = (req: Request, res: Response) => {
    try {
        let query = `SELECT id, post_id FROM posts_liked WHERE profile_id=${req.profile.id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            let postsLiked = result;

            query = `SELECT id, comment_id FROM comments_liked WHERE profile_id=${req.profile.id}`

            db.query(query, (err:MysqlError, result) => {
                if(err) throw err;

                let commentsLiked = result;

                query = `SELECT id, answer_id FROM answers_liked WHERE profile_id=${req.profile.id}`

                db.query(query, (err: MysqlError, result) => {
                    if(err) throw err;

                    let answersLiked = result;

                    res.json({postsLiked, commentsLiked, answersLiked});
                })
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}