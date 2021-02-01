import {Request, Response, NextFunction} from 'express'
import db from '../config/db';
import {verify} from 'jsonwebtoken'
import {MysqlError} from 'mysql'
import {config} from 'dotenv'
import {instanceOfUserPayload} from '../helper'

config();

export const userById = (req: Request, res: Response, next: NextFunction, id: number) => {
    try {
        let query = `SELECT * FROM users WHERE id=${id}`;

        db.query(query, (err: MysqlError, result) => {
            if (err) throw err;

            if (result.length === 0) {
                return res.status(404).json({ error: "User does not exist" });
            }

            req.user = result[0];

            req.user.password = undefined;

            next();
        });
    
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const loginRequired = (req: Request, res: Response, next: NextFunction) => {
    try {
        let auth = req.headers.authorization?.split(" ")[1];
    
        if (!auth) {
          return res.status(401).json({ error: "User not authorized" });
        }
    
        let secret = process.env.JWT_SECRET || "secret";
    
        verify(auth, secret, (err, decoded) => {
          if (err) throw err;

          if(decoded && instanceOfUserPayload(decoded)){
            req.auth = decoded;
          }
    
          next();
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.user.username === req.auth.username && req.user.email === req.auth.email){
            next();
        }else{
            res.status(401).json({error: "User not authorized. False credentials"})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}