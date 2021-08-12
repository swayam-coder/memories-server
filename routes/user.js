const express = require("express");
const router = express.Router();
const {login, register, verifyToken} = require("../controllers/user")

router.post("/refreshToken", verifyToken);

router.post("/login", login);

router.post("/signup", register);

module.exports = router;