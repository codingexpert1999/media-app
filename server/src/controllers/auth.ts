import {MysqlError} from 'mysql';
import {hash, genSalt, compare} from 'bcrypt';
import {config} from 'dotenv'
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../config/db';
import {createToken, verifyToken, JwtErrorType} from '../util/auth'

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

                query = `SELECT * FROM users WHERE username=${username} AND email=${email}`;

                db.query(query, async (err: MysqlError, result) => {
                    if(err) throw err;

                    let user = result[0];
                    user.password = undefined;

                    let payload = {
                        username, email, id: user.id
                    }

                    const accessToken = await createToken(payload, jwtSecret, "2h");
                    const refreshToken = await createToken(payload, jwtSecret, "7d");

                    if(accessToken.token && refreshToken.token){
                        req.session.accessToken = accessToken.token;
                        req.session.user = user;
                        res.cookie("token", refreshToken.token, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: "strict"})

                        res.json({user: payload})
                    }else{
                        res.json({error: "Something went wrong!"})
                    }
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

            user.password = undefined;

            let payload = {
                username: user.username, email: user.email, id: user.id
            }

            const accessToken = await createToken(payload, jwtSecret, "2h");
            const refreshToken = await createToken(payload, jwtSecret, "7d");

            if(accessToken.token && refreshToken.token){
                req.session.accessToken = accessToken.token;
                req.session.user = user;
                res.cookie("token", refreshToken.token, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: "strict"})

                req.session.save((err) => {
                    if(err) throw err;

                    res.json({user: payload});
                });
            }else{
                res.json({error: "Something went wrong!"})
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    try {
        if(req.session.accessToken){
            return res.json({success: true});
        }

        let token = req.cookies.token;

        const verification = await verifyToken(token, jwtSecret);

        if(verification.error === JwtErrorType.INVALID){
            return res.status(401).json({error: "User not authorized."});
        }else if(verification.error === JwtErrorType.EXPIRED){
            const payload = {id: req.user.id, email: req.user.email, username: req.user.username}

            const accessToken = await createToken(payload, jwtSecret, "2h");
            const refreshToken = await createToken(payload, jwtSecret, "7d");

            if(accessToken.token && refreshToken.token){
                req.session.accessToken = accessToken.token;
                res.cookie("token", refreshToken.token, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: "strict"})

                res.json({success: true})
            }else{
                res.json({success: false})
            }
        }else{
            if(!req.session.accessToken){
                const payload = {id: req.user.id, email: req.user.email, username: req.user.username}

                const accessToken = await createToken(payload, jwtSecret, "2h");
                const refreshToken = await createToken(payload, jwtSecret, "7d");

                if(accessToken.token && refreshToken.token){
                    req.session.accessToken = accessToken.token;
                    res.cookie("token", refreshToken.token, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: "strict"})
    
                    res.json({success: true})
                }else{
                    res.json({success: false})
                }
            }
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}