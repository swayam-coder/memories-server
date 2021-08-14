const userInfo = require('../models/user');
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateEmailToken, verifyEmailToken } = require("../util/_jwt-helper");
const { sendEmail } = require("../util/_sendemail");
const mongoose = require("mongoose")

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

const confirmPassword = async (req, res, next) => {
    const { password } = req.body
    try {
        const user = await userInfo.findOne({ _id: req.userId }).select('password email')
        const check = await bcrypt.compare(password, user.password)

        if(!check)
            next(createError.Unauthorized("Wrong password entered"))

        const token = await generateEmailToken(user)
        const url = `${req.headers.origin}/password-reset/${user._id}/${token}`  // doubt
        console.log(url);
        await sendEmail(user.email, url)

        res.json({ sentEmail: true, url: `/password-reset/${user._id}/${token}` })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const passwordTokenVerify = async (req, res, next) => {
    try {
        const { id, token } = req.body
        
        await verifyEmailToken(token);

        if (!mongoose.Types.ObjectId.isValid(id)) throw createError.InternalServerError("Page not found")
    
        const idVerify = id === req.userId

        if(!idVerify) res.json({ urlStatus: "verified" })
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { email, newpassword, oldpassword } = req.body;
        const user = await userInfo.find({_id: req.userId}).select('email password')

        const passwordcheck = await bcrypt.compare(oldpassword, user.password)

        if(user.email !== email)
            throw createError.Unauthorized("email entered is not registered")

        if(!passwordcheck)
            throw createError.Unauthorized("Wrong password entered")
    
        const hashedNewPassword = await bcrypt.hash(newpassword, 12);
        
        await userInfo.findByIdAndUpdate(req.userId, { password: hashedNewPassword })
        
        res.json({ updated: true })
    } catch (error) {
        console.log(error);
        next(error)
    }
    
}

module.exports = {login, register, verifyToken, confirmPassword, changePassword, passwordTokenVerify}

