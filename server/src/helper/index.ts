import {UserPayload} from '../interfaces'

export const instanceOfUserPayload = (data: any): data is UserPayload => { 
    return 'username' in data && "email" in data; 
} 