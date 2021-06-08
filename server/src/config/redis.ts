import {createClient} from 'redis'

const redisClient = createClient({port: 6379, host: "localhost"});

redisClient.on("error", (err) => {
    console.log(err)
    process.exit(1)
})

redisClient.on("connect", (err) => {
    console.log("Connected to Redis...")
})

export const publisher = createClient({port: 6379, host: "localhost"});

publisher.on("connect", (err) => {
    console.log("Connected to Redis Publisher...")
})

export const subscriber = createClient({port: 6379, host: "localhost"});

subscriber.on("connect", (err) => {
    console.log("Connected to Redis Subscriber...")
})

export default redisClient;