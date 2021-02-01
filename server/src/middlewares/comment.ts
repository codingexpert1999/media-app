import {Request, Response, NextFunction} from 'express'
import db from '../config/db';
import {MysqlError} from 'mysql'

export const commentById = (req: Request, res: Response, next: NextFunction, id: number) => {
    try {
        let query = `SELECT * FROM comments WHERE id=${id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Comment not found"});
            }

            req.comment = result[0];

            next();
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }
}