import {MysqlError} from 'mysql';
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../config/db';

export const fetch = (req: Request, res: Response) => {
    try {
        let query = `SELECT * FROM answers WHERE comment_id=${req.comment.id} ORDER BY created_at DESC`;

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

        const {answerText, profileId} = req.body;

        let query = `
            INSERT INTO answers(answer_text, profile_id, comment_id) 
            VALUES('${answerText}', ${profileId}, ${req.comment.id})
        `;

        db.query(query, (err:MysqlError) => {
            if(err) throw err;

            res.json({message: "Answer created successfully!"})
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

        const {answer_text, profile_id, id} = req.answer;

        let query = `
            UPDATE answers SET answer_text='${answerText}'
            WHERE id=${id} AND profile_id=${profile_id}
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
        let query = `DELETE FROM answers WHERE id=${req.answer.id} AND profile_id=${req.answer.profile_id}`;

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
        let query = `UPDATE answers SET likes=${req.answer.likes + 1} WHERE id=${req.answer.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Answer liked"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const unlike = (req: Request, res: Response) => {
    try {
        let query = `UPDATE answers SET likes=${req.answer.likes - 1 <= 0 ? 0 : req.answer.likes - 1} WHERE id=${req.answer.id}`;

        db.query(query, (err: MysqlError) => {
            if(err) throw err;

            res.json({message: "Answer unliked"})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}