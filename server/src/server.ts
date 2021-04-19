import {Answer, Post, User, Comment, Profile} from './interfaces'

declare global {
    namespace Express {
        interface Request {
            user: User;
            post: Post;
            comment: Comment;
            answer: Answer;
            profile: Profile;
            authToken: string;
        }
    }
}

declare module 'express-session' {
    interface SessionData {
      user: User;
      profile: Profile;
      accessToken: string;
      posts: Post[];
      postsChanged: boolean;
    }
}

import express from 'express';
import {config} from 'dotenv'

import connectRedis from 'connect-redis';
import session from 'express-session'

import db from './config/db';

import authRoutes from "./routes/auth"
import postRoutes from './routes/post'
import commentRoutes from './routes/comment'
import answerRoutes from './routes/answer'
import profileRoutes from './routes/profile'
import redisClient from './config/redis';
import cookieParser from 'cookie-parser';
import { cors } from './middlewares/cors';

config();

const app = express();

// Connect to database
db.connect((err) => {
    if(err) {
        console.log(err)
        process.exit(1)
    }

    console.log("Connected to database...")
})

// app.set('trust proxy', 1);

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const redisStore = connectRedis(session);
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

app.use(cookieParser(SESSION_SECRET))
app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    name: "session_id",
    store: new redisStore({client: redisClient}),
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,
        domain: 'localhost',
        path: "/",
        sameSite: "strict"
    },
    unset: "destroy"
}))

// Routes
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api", answerRoutes);
app.use("/api", profileRoutes);

const PORT = parseInt(process.env.PORT!) || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))