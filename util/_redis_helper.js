// const { client } = require("./_init_redis")

// const getdata = async (id) => {
//     client.get(`posts/${id}`, async (errors, posts) => {
//         if(errors)
//             console.log(errors);
//         if(posts !== null){
//             console.log("redis hit");
//             return JSON.parse(posts)
//         }
//         else {
//             console.log("redis miss");
//             return null
//         }
//     })
// }

// module.exports = { getdata } 