import { NextFunction, Request, Response } from 'express'
import { MysqlError } from 'mysql';
import db from '../config/db'

export const conversationById = (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        if(id.length !== (parseInt(id) + "").length){
            return res.status(400).json({error: "Bad request!"})
        }

        let query = `SELECT * FROM conversations WHERE id=${id}`;

        db.query(query, (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Conversation not found"});
            }

            req.conversation = result[0];

            next();
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }
}