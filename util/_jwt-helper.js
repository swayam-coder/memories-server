const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    const options = {
        expiresIn: "1h", 
        issuer: "memories.com", 
    }

    const userinfo = {
        email: user.email, 
        id: user._id
    }

    return new Promise((resolve, reject) => {
        jwt.sign(userinfo, process.env.ACCESS_TOKEN_SECRET, options, (err, info) => {
            if(err) {
                console.log(err);
                reject(createError.InternalServerError())
                return
            }
            resolve(info)
        });
    }) 
}

const generateRefreshToken = (user) => {
    const options = {
        expiresIn: "1y", 
        issuer: "memories.com",
    }

    const userinfo = {
        email: user.email, 
        id: user._id
    }

    return new Promise((resolve, reject) => {
        jwt.sign(userinfo, process.env.REFRESH_TOKEN_SECRET, options, (err, info) => {
            if(err) {
                console.log(err);
                reject(createError.InternalServerError())
                return
            }
            resolve(info)
        });
    }) 
}

const verifyRefreshToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, info) => {
            if(err){
                reject(err)
            }
            resolve(info)
        })
    })
}

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken }