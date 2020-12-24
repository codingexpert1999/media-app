import express from 'express';
import {config} from 'dotenv'
import cors from 'cors';

import db from './config/db';

import authRoutes from "./routes/auth"

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

const PORT = parseInt(process.env.PORT!) ||5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))