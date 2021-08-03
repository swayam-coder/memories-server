const express = require("express");
const userInfo = require('../models/user.js');
const mongoose = require("mongoose");
const { route } = require("./posts.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { generateAccessToken, generateRefreshToken } = require("../util/_jwt-helper");
const secret = process.env.ACCESS_TOKEN_SECRET;

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userInfo.findOne({ email: email })
        if(!user) return res.json({ message: "user is not registered"});

        const correctPassword = await bcrypt.compare(password, user.password);  // bcrypt will automatically encrypt entered password while comparing the password (already encrypted) in database
        if(!correctPassword) return res.json("entered password is wrong");
        
        const Accesstoken = generateAccessToken(user);
        const RefreshToken = generateRefreshToken(user);

        if(!Accesstoken || !RefreshToken) return
        
        res.json({result: user, Accesstoken, RefreshToken})
    } catch (error) {
        console.log(error);
    }
});

router.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        //check if user already exists
        const user = await userInfo.findOne({ email })
        if(user) return res.json({ message: "user is already registered"});
        
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 12);  // here 12 is brcypt salt...know more about this

        //store the user to the database
        const result = await userInfo.create({email: email, password: hashedPassword, name: `${firstName} ${lastName}`});

        //create the token
        const Accesstoken = generateAccessToken(user);
        const RefreshToken = generateRefreshToken(user);

        if(!Accesstoken || !RefreshToken) return

        //response sent
        res.json({result, Accesstoken, RefreshToken});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;