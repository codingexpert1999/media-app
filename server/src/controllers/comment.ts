import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../config/db';

export const fetch = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM comments WHERE post_id=${req.post.id} ORDER BY created_at DESC`;

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
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {commentText, profileId} = req.body;

        let query = `
            INSERT INTO comments(comment_text, profile_id, post_id) 
            VALUES('${commentText}', ${profileId}, ${req.post.id})
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Comment created successfully!"})
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

        const {comment_text, profile_id, id} = req.comment;

        let query = `
            UPDATE comments SET comment_text='${commentText}'
            WHERE id=${id} AND profile_id=${profile_id}
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
        let query = `DELETE FROM comments WHERE id=${req.comment.id} AND profile_id=${req.comment.profile_id}`;

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
        let query = `UPDATE comments SET likes=${req.comment.likes + 1} WHERE id=${req.comment.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Comment liked"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const unlike = (req: Request, res: Response) => {
    try {
        let query = `UPDATE comments SET likes=${req.comment.likes - 1 <= 0 ? 0 : req.comment.likes - 1} WHERE id=${req.comment.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Comment unliked"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}