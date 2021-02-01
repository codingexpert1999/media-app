import {MysqlError} from 'mysql';
import {hash, genSalt, compare} from 'bcrypt';
import {sign, verify} from 'jsonwebtoken';
import {config} from 'dotenv'
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../config/db';

config()

const jwtSecret = process.env.JWT_SECRET || "";

export const signup = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {username, email, password} = req.body

        let query = `SELECT * FROM users WHERE username='${username}' OR email='${email}'`;

        db.query(query, async (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length !== 0){
                return res.status(400).json({error: "Username or email is already taken!"})
            }

            let salt = await genSalt(10);

            let encryptedPassword = await hash(password, salt);

            query = `CALL registerUser('${username}', '${email}', '${encryptedPassword}', '/assets/user.png')`;

            db.query(query, (err:MysqlError) => {
                if(err) throw err;

                let payload = {
                    username, email
                }

                sign(payload, jwtSecret, {expiresIn: 86400000}, (err, token) => {
                    if(err) throw err;

                    res.json({
                        user: payload,
                        token
                    })
                })
            })
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}


export const login = (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {email, password} = req.body

        let query = `SELECT * FROM users WHERE email='${email}'`;

        db.query(query, async (err: MysqlError, result) => {
            if(err) throw err;

            if(result.length === 0){
                return res.status(404).json({error: "Email or password is incorrect!"})
            }

            let user = result[0];

            let isMatch = await compare(password, user.password);

            if(!isMatch){
                return res.status(404).json({error: "Email or password is incorrect!"})
            }

            let payload = {
                username: user.username, email: user.email
            }

            sign(payload, jwtSecret, {expiresIn: 86400000}, (err, token) => {
                if(err) throw err;

                res.json({
                    user: payload,
                    token
                })
            })
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}