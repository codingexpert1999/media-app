import {Answer, Post, User, UserPayload, Comment, Profile} from './interfaces'

declare global {
    namespace Express {
        interface Request {
            user:User;
            auth: UserPayload;
            post: Post;
            comment: Comment;
            answer: Answer;
            profile: Profile;
        }
    }
}

import express from 'express';
import {config} from 'dotenv'
import cors from 'cors';

import db from './config/db';

import authRoutes from "./routes/auth"
import postRoutes from './routes/post'
import commentRoutes from './routes/comment'
import answerRoutes from './routes/answer'
import profileRoutes from './routes/profile'

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

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routes
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);
app.use("/api", answerRoutes);
app.use("/api", profileRoutes);

const PORT = parseInt(process.env.PORT!) || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))