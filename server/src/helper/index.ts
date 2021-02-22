import { asyncQuery } from '../config/db';
import {UserPayload} from '../interfaces'

export const instanceOfUserPayload = (data: any): data is UserPayload => { 
    return 'username' in data && "email" in data; 
} 

export const getAsyncMysqlResult = async (query: string) => {
    return asyncQuery(query);
}