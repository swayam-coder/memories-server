const mongoose = require("mongoose");

const postContentSchema = mongoose.Schema({
    name: String,
    content: String,
    creator: String,
    creatorName: String,  // new
    tags: [String],
    selectedFile: String,
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Number,
        default: new Date()
    },
});

var postInfo = mongoose.model('postinfo', postContentSchema);

module.exports = postInfo;
