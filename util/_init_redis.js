// const redis = require("redis") ;

// const client =  redis.createClient();

// client.on("connect", () => {
//     console.log("client connected to redis");
// })

// client.on("ready", () => {
//     console.log("client connected to redis");
// })

// client.on("error", (err) => {
//     console.log(err.message);
// })

// client.on("end", () => {
//     console.log("client disconnected from redis");
// })

// process.on("SIGINT", () => {
//     client.quit();
// })

// module.exports = { client };