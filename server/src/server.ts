import {Answer, Post, User, Comment, Profile, Conversation, Convo, Message} from './interfaces'

declare global {
    namespace Express {
        interface Request {
            user: User;
            post: Post;
            comment: Comment;
            answer: Answer;
            profile: Profile;
            authToken: string;
            conversation: Conversation;
        }
    }
}

declare module 'express-session' {
    interface SessionData {
      user: User;
      profile: Profile;
      accessToken: string;
    }
}

import express from 'express';
import http from 'http'
import redisAdapter from '@socket.io/redis-adapter'
import {Server} from 'socket.io'
import {config} from 'dotenv'

import connectRedis from 'connect-redis';
import session from 'express-session'

import db from './config/db';

import authRoutes from "./routes/auth"
import postRoutes from './routes/post'
import commentRoutes from './routes/comment'
import answerRoutes from './routes/answer'
import profileRoutes from './routes/profile'
import messageRoutes from './routes/messages'

import redisClient, { publisher, subscriber } from './config/redis';
import cookieParser from 'cookie-parser';
import { cors } from './middlewares/cors';
import { MysqlError } from 'mysql';

config();

const app = express();

const server = http.createServer(app);

// Connect to database
db.connect((err) => {
    if(err) {
        console.log(err)
        process.exit(1)
    }

    console.log("Connected to database...")
})

const io = new Server(
    server, 
    { 
        cors: {origin: 'http://localhost:3000'},
        adapter: redisAdapter.createAdapter(publisher, subscriber)
    }
)

io.on("connection", socket => {
    socket.on("open-convo", (convoId: number) => {
        socket.join('convo-' + convoId);
        redisClient.set(socket.id, convoId + "");
    })

    socket.on("message", (profileId: number, friendProfileId: number, message: string, isIcon: boolean) => {
        redisClient.get(socket.id, (err, reply) => {
            if(err) throw err;

            if(reply){
                let convoId = parseInt(reply);

                let messageObj: Message = {
                    id: Date.now(),
                    message,
                    profile_id: profileId,
                    seen: 0,
                    conversation_id: convoId,
                    is_icon: isIcon ? 1 : 0,
                    created_at: new Date().toISOString()
                }

                io.to("convo-"+convoId).emit("new-message", messageObj);
        
                try {
                    let query = "";
        
                    if(isIcon){
                        query = `
                            INSERT INTO messages(message, profile_id, conversation_id, is_icon) 
                            VALUES('${message}', ${profileId}, ${convoId}, TRUE)
                        `;
                    }else{
                        query = `
                            INSERT INTO messages(message, profile_id, conversation_id) 
                            VALUES('${message}', ${profileId}, ${convoId})
                        `;
                    }
                    
                    db.query(query, (err: MysqlError) => {
                        if(err) throw err;
        
                        redisClient.get(profileId + "-conversations", (err, reply) => {
                            if(err) throw err;

                            let conversations: Convo[];

                            if(reply){
                                conversations = JSON.parse(reply + "") as Convo[];

                                if(conversations.length > 0){
                                    let convosChanged = false;

                                    for(let i = 0; i < conversations.length; i++){
                                        if(conversations[i].id === convoId){
                                            conversations[i].lastMessage = messageObj;
                                            convosChanged = true;
                                        }
                                    }
    
                                    if(convosChanged){
                                        redisClient.setex(profileId + "-convos-changed", 3600 * 2, 'true')
                                        redisClient.setex(profileId + "-conversations", 3600 * 2, JSON.stringify(conversations))
                                    }
                                }else{
                                    redisClient.setex(profileId + "-convos-changed", 3600 * 2, 'true')
                                }
                            }else{
                                redisClient.setex(profileId + "-convos-changed", 3600 * 2, 'true')
                            }
                        })

                        redisClient.get(friendProfileId + "-conversations", (err, reply) => {
                            if(err) throw err;
        
                            let conversations: Convo[];

                            if(reply){
                                conversations = JSON.parse(reply + "") as Convo[];

                                if(conversations.length > 0){
                                    let convosChanged = false;

                                    for(let i = 0; i < conversations.length; i++){
                                        if(conversations[i].id === convoId){
                                            conversations[i].lastMessage = messageObj;
                                            convosChanged = true;
                                        }
                                    }
    
                                    if(convosChanged){
                                        redisClient.setex(friendProfileId + "-convos-changed", 3600 * 2, 'true')
                                        redisClient.setex(friendProfileId + "-conversations", 3600 * 2, JSON.stringify(conversations))
                                    }
                                }else{
                                    redisClient.setex(friendProfileId + "-convos-changed", 3600 * 2, 'true')
                                }
                            }else{
                                redisClient.setex(friendProfileId + "-convos-changed", 3600 * 2, 'true')
                            }
                        })
                    })
                } catch (err) {
                    console.log(err);
                }
            }
        })
    })

    socket.on('typing', (profileId, isTyping: boolean) => {
        redisClient.get(socket.id, (err, reply) => {
            if(err) throw err;

            if(reply){
                let convoId = parseInt(reply);

                io.to("convo-"+convoId).emit(profileId + "-is-typing", isTyping);
            }
        })
    })

    socket.on("disconnect", async () => {
        redisClient.get(socket.id, (err, reply) => {
            if(err) throw err;

            redisClient.del(socket.id);
        })
    })
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
app.use("/api", messageRoutes);

const PORT = parseInt(process.env.PORT!) || 5000

server.listen(PORT, () => console.log(`Server started on port ${PORT}...`))