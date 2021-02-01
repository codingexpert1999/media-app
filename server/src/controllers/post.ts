import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../config/db';

export const fetch = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM posts ORDER BY created_at DESC`;

        db.query(query, (err:MysqlError, result) => {
            if(err) throw err;

            res.json(result);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const create = (req: Request, res: Response) => {
    try {
        const {postText, postImage, postVideo, profileId} = req.body;

        if(!postText && !postImage && !postVideo){
            return res.status(400).json({error: "Text, image or video is required"})
        }

        let query = `
            INSERT INTO posts(post_text, post_image, post_video, profile_id) 
            VALUES('${postText ?? ''}', '${postImage ?? ''}', '${postVideo ?? ''}', ${profileId})
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Post created successfully!"})
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

        const {post_text, post_image, post_video, profile_id, id} = req.post;

        let query = `
            UPDATE posts SET post_text='${post_text ?? ''}', post_image='${post_image ?? ''}', post_video='${post_video ?? ''}'
            WHERE id=${id} AND profile_id=${profile_id}
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
        let query = `UPDATE posts SET likes=${req.post.likes + 1} WHERE id=${req.post.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Post liked"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const unlike = (req: Request, res: Response) => {
    try {
        let query = `UPDATE posts SET likes=${req.post.likes - 1 <= 0 ? 0 : req.post.likes - 1} WHERE id=${req.post.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Post unliked"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}