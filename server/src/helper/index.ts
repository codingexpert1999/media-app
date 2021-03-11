import { asyncQuery } from '../config/db';

export const getAsyncMysqlResult = (query: string) => {
    return asyncQuery(query);
}