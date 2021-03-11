import {createClient} from 'redis'

const redisClient = createClient({port: 6379, host: "localhost"});

redisClient.on("error", (err) => {
    console.log(err)
    process.exit(1)
})

redisClient.on("connect", (err) => {
    console.log("Connected to Redis...")
})

export default redisClient;