import {verify, sign} from 'jsonwebtoken'
import { UserPayload, JwtError } from '../interfaces'

export enum JwtErrorType{
    NONE,
    EXPIRED,
    INVALID
}

export const createToken = (payload: UserPayload, secret: string, expiresIn: string)
    : Promise<{token: string | null}> => 
    new Promise((resolve, reject) => 
        sign(payload, secret, {expiresIn}, (err, token) => {
            if(err){
                reject({token: null})
            }else{
                resolve({token: token!})
            }
        })
    );


export const verifyToken = (token: string, secret: string) 
    : Promise<{payload: UserPayload | null, error: JwtErrorType}> => {
    return new Promise((resolve, reject) => {
        verify(token, secret, (err, decoded) => {
            if(err){
                if('error' in err){
                    let jwtError: JwtError = err;
    
                    if(jwtError.error === "jwt expired"){
                        reject({payload: null,  error: JwtErrorType.EXPIRED});
                    }else{
                        reject({payload: null, error: JwtErrorType.INVALID})
                    }
                }else{
                    reject({payload: null, error: JwtErrorType.INVALID})
                }
            }else{
                resolve({payload: decoded! as UserPayload, error: JwtErrorType.NONE})
            }
        })
    })
}