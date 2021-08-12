const postInfo = require('../models/postContent');
const mongoose = require("mongoose");
const createError = require("http-errors");
const { getdata } = require("../util/_redis_helper")
const client = require("../util/_init_redis")

const feedposts = async (req, res, next) => {
    try {
        const postMessages = await postInfo.find({});
        res.status(200).json(postMessages);
    } catch (error) {
        console.log(error.status);
        next(createError.NotFound())
    }
}

const posts = async (req, res, next) => {
    try {
        const postMessages = await postInfo.find({ creator: req.userId });
        console.log("fetched posts", postMessages);
        res.status(200).json(postMessages);
        // const posts = await getdata(req.userId);
        
        // if(posts !== null) {
        //     res.status(200).json(posts);
        // } else {
        //     const postMessages = await postInfo.find({ creator: req.userId }).select('-creator');
        //     client.setex(`posts/${req.userId}`, 20, JSON.stringify(postMessages))
        //     res.status(200).json(postMessages);
        // }
    } catch (error) {
        console.log(error.status);
        next(createError.NotFound())
    }
}

const createposts = async (req, res, next) => {
    const post = req.body; // req.body.newpost?
    const newPost = new postInfo({ ...post, creator: req.userId, createdAt: new Date() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        if(error.status === 409) {
            next(createError.Conflict("Couldn't add post ! Some error occured..."))
        } else {
            next(createError.InternalServerError("Couldn't update! Are you offline?"))
            console.log(error);
        }
    }
}

const updateposts = async (req, res, next) => {
    const { id } = req.params;
    const { name, content, creator, tags, selectedFile } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id))
        console.log(`Invalid Id: ${id}`);
    
    const updatedPost = { name, content, creator, tags, selectedFile }
    try {
        await postInfo.findByIdAndUpdate(id, {...updatedPost, _id: id}, {new: true});
        res.json(updatedPost);
    } catch (error) {
        if(error.status === 409) {
            next(createError.Conflict("Couldn't update post ! Some error occured..."))
        } else {
            next(createError.InternalServerError("Couldn't update post! Are you offline?"))
            console.log(error);
        }
    }
}

const likeposts = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const { name, content, creator, tags, selectedFile } = req.body;
    const post = await postInfo.findById(id); // postInfo.find({_id: id}) could also have worked instead of findById but it didn't, why?

    const updatedPost = { name, content, creator, tags, selectedFile }

    try {
        const info = await postInfo.findByIdAndUpdate(id, {...updatedPost, likes: post.likes + 1, _id: id}, { new: true }).select('-creator');
        res.json(info);
    } catch (error) {
        if(error.status === 409) {
            next(createError.Conflict("Couldn't like! Some error occured..."))
        } else {
            next(createError.InternalServerError("Couldn't like! Are you offline?"))
            console.log(error);
        }
    }
}

const deleteposts = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    try {
        const info = await postInfo.findByIdAndDelete(id).select('-creator');
        res.json(info);
    } catch (error) {
        if(error.status === 409) {
            next(createError.Conflict("Couldn't delete post! Some error occured..."))
        } else {
            next(createError.InternalServerError("Couldn't delete post! Are you offline?"))
            console.log(error);
        }
    }
}

module.exports = {feedposts, deleteposts, likeposts, updateposts, createposts, posts}

