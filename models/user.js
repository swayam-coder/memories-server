const mongoose = require("mongoose");

const userInfoSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

var userInfo = mongoose.model('userinfo', userInfoSchema);

module.exports = userInfo;
