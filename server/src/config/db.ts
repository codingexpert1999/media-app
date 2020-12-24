import mysql from 'mysql';
import { config } from "dotenv";

config();

let user = process.env.DB_USER || "";
let host = process.env.DB_HOST || "";
let port = parseInt(process.env.DB_PORT || "0");
let password = process.env.DB_PASSWORD || "";
let database = process.env.DB_NAME || "";

const db = mysql.createConnection({
    user,
    host,
    port,
    password,
    database
})

export default db