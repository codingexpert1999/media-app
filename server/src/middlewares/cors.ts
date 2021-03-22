import {Request, Response, NextFunction} from 'express'

export const cors = (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, credentials, withcredentials');
    res.header("Content-Security-Policy", "script-src 'self'");
    next();
}