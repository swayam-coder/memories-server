const userInfo = require('../models/user');
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../util/_jwt-helper");

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const response = await userInfo.findOne({ email: email })
        if(!response) {
            throw createError.NotFound(`${email} not found`)
        }

        const correctPassword = await bcrypt.compare(password, response.password);  // bcrypt will automatically encrypt entered password while comparing the password (already encrypted) in database
        if(!correctPassword) {
            throw createError.Unauthorized(`Wrong Password`)
        }

        const AccessToken = await generateAccessToken(response)
        const RefreshToken = await generateRefreshToken(response)

        const result = {
            email: response.email,
            name: response.name,
            id: response._id
        }

        res.status(200).json({result, AccessToken, RefreshToken});
    } catch (error) {
        next(error);
    }
}

const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        //check if user already exists
        const user = await userInfo.findOne({ email })
        if(user)
            throw createError.Conflict(`${email} is already registered`)
        
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 12);  // here 12 is brcypt salt...know more about this

        //store the user to the database
        const response = await userInfo.create({email: email, password: hashedPassword, name: `${firstName} ${lastName}`});

        //create the token
        const AccessToken = await generateAccessToken(response)
        const RefreshToken = await generateRefreshToken(response)

        const result = {
            email: response.email,
            name: response.name,
            id: response._id
        }
        
        res.status(200).json({result, AccessToken, RefreshToken});
    } catch (error) {
        next(error)
    }
}

const verifyToken = async (req, res, next) => {
    const { refreshToken } = req.body
    try {
        const user = verifyRefreshToken(refreshToken);

        const NewAccessToken = await generateAccessToken(user);
        res.status(200).json({ NewAccessToken })
    } catch (error) {
        if(error.name === "TokenExpiredError") {
            next(createError.Unauthorized())
        } else {
            console.log(error);
            next(createError.InternalServerError())
        }
    }
}

module.exports = {login, register, verifyToken }

