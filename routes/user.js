const express = require("express");
const router = express.Router();
const { login, register, verifyToken, confirmPassword, changePassword, passwordTokenVerify } = require("../controllers/user")
const auth = require("../middleware/auth");

router.post("/refreshToken", verifyToken);

router.post("/login", login);

router.post("/signup", register);

router.post("/confirmpassword", auth, confirmPassword);

router.post("/changepassword", auth, changePassword);

router.post("/passwordtokenverify", auth, passwordTokenVerify);

module.exports = router;