import createError from "http-errors";
import jwt from "jsonwebtoken"

const generateAccessToken = (user) => {
    try {
        const AccessToken = jwt.sign({ email: user.email, id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h", issuer: "memories.com", audience: user._id });
        return AccessToken;
    } catch (error) {
        next(createError.InternalServerError())
    }
}

const generateRefreshToken = (user) => {
    try {
        const RefreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1y", issuer: "memories.com", audience: user._id });
        return RefreshToken;
    } catch (error) {
        next(createError.InternalServerError())
    }
}

module.exports = { generateAccessToken, generateRefreshToken }