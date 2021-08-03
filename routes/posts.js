const express = require("express");
const postInfo = require('../models/postContent.js');
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async(req, res) =>{
    try {
        const postMessages = await postInfo.find({ creator: req.userId });
        res.status(200).json(postMessages); 
    } catch (error) {
        res.status(404).json({ message: error.message }); 
    }
});

router.post("/", auth, async (req, res) => {
    const post = req.body; // req.body.newpost?
    const newPost = new postInfo({ ...post, creator: req.userId, createdAt: new Date() });
    try {
        await newPost.save();
        res.status(201).json(newPost); 
    } catch (error) {
        res.status(409).json({ message: error }); 
    }
});

router.patch("/:id", auth, async (req, res) => {  //some changes to be done
    const { id } = req.params;
    const { name, content, creator, tags, selectedFile } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);  // important
    
    const updatedPost = { name, content, creator, tags, selectedFile }
    try {
        await postInfo.findByIdAndUpdate(id, {...updatedPost, _id: id}, {new: true});
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
    }
    
}); 

router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    try {
        const info = await postInfo.findByIdAndDelete(id);
        res.json(info);
    } catch (error) {
        console.error(error);
    }
});

router.patch("/:id/updatelikes", auth, async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const { name, content, creator, tags, selectedFile } = req.body;
    const post = await postInfo.findById(id); // postInfo.find({_id: id}) could also have worked instead of findById but it didn't, why?

    const updatedPost = { name, content, creator, tags, selectedFile }

    try {
        const info = await postInfo.findByIdAndUpdate(id, {...updatedPost, likes: post.likes + 1, _id: id}, { new: true });
        res.json(info);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;