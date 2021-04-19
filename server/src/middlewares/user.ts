import {Request, Response, NextFunction} from 'express'
import db from '../config/db';
import {MysqlError} from 'mysql'
import {config} from 'dotenv'
import { verifyToken, JwtErrorType, createToken } from '../util/auth';

config();

const jwtSecret = process.env.JWT_SECRET || "";

export const userById = (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        if(id.length !== (parseInt(id) + "").length){
            return res.status(400).json({error: "Bad request!"})
        }

        if(req.session.user){
            req.user = req.session.user;
            next();
        }else{
            let query = `SELECT * FROM users WHERE id=${id}`;

            db.query(query, (err: MysqlError, result) => {
                if (err) throw err;
    
                if (result.length === 0) {
                    return res.status(404).json({ error: "User does not exist" });
                }

                req.user = result[0];
    
                req.user.password = undefined;

                req.session.user = req.user;
                req.session.save((err) => {
                    if(err) throw err;

                    next();
                })
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const profileById = (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        if(id.length !== (parseInt(id) + "").length){
            return res.status(400).json({error: "Bad request!"})
        }
        
        if(req.session.profile){
            req.profile = req.session.profile;
            next();
        }else{
            let query = `SELECT * FROM profiles WHERE id=${id}`;

            db.query(query, (err: MysqlError, result) => {
                if (err) throw err;
    
                if (result.length === 0) {
                    return res.status(404).json({ error: "Profile does not exist" });
                }
    
                req.profile = result[0];
    
                if(req.profile.user_id !== req.user.id){
                    return res.status(404).json({ error: "False Credentials. Wrong Profile!" });
                }

                req.session.profile = req.profile;
                next();
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
}

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let auth: string = req.session.accessToken || req.cookies.token;
    
        if (!auth) {
          return res.status(401).json({ error: "User not authorized" });
        }
    
        let secret = process.env.JWT_SECRET || "secret";

        const verification = await verifyToken(auth, jwtSecret);

        if(verification.error === JwtErrorType.INVALID){
            return res.status(401).json({ error: "User not authorized" });
        }else if(verification.error === JwtErrorType.EXPIRED){
            let payload = {
                username: req.session.user!.username, email: req.session.user!.email, id: req.session.user!.id
            }

            const accessToken = await createToken(payload, jwtSecret, "2h");
            const refreshToken = await createToken(payload, jwtSecret, "7d");

            if(accessToken.token && refreshToken.token){
                req.session.accessToken = accessToken.token;
                res.cookie("token", refreshToken.token, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: "strict"})

                next();
            }else{
                return res.status(500).json({error: "Something went wrong"})
            }
        }else{
            if(!req.session.accessToken){
                let payload = {
                    username: req.session.user!.username, email: req.session.user!.email, id: req.session.user!.id
                }

                const accessToken = await createToken(payload, jwtSecret, "2h");
                const refreshToken = await createToken(payload, jwtSecret, "7d");

                if(accessToken.token && refreshToken.token){
                    req.session.accessToken = accessToken.token;
                    res.cookie("token", refreshToken.token, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: false, sameSite: "strict"})

                    next();
                }else{
                    return res.status(500).json({error: "Something went wrong"})
                }
            }else{
                next()
            }
        }

      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
}