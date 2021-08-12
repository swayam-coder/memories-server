const jwt = require("jsonwebtoken");
const createErrors = require("http-errors");

const auth = async (req, res, next) => {
  try {
    if(!req.headers.authorization) {
      console.log("header is empty");
      return
    }

    const Accesstoken = req.headers.authorization.split(" ")[1];
    const isCustomAuth = Accesstoken.length < 500;  // if length is less than 500 then token is custom

    let decodedData;

    if (Accesstoken && isCustomAuth) {      // if the token is custom token
      jwt.verify(Accesstoken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) {
          const errormsg = (err.name === "JsonWebTokenError") ? "Unauthorized User" : err.message;
          throw createErrors.Unauthorized(errormsg)  // if token would have expired
        }
        req.userId = payload.id;
      })

      if(req.userId) {
        next()
      }
    } else {                          // if the token is oauth token
      jwt.decode(Accesstoken, (err, payload) => {
        if(err) {
          const errormsg = (err.name === "JsonWebTokenError") ? "Unauthorized User" : err.message;
          throw createErrors.Unauthorized(errormsg);
        }
        req.userId = payload.sub;
      })

      if(req.userId) {
        next();
      }
    }
  } catch (error) {
      console.log(error);
  }
};

module.exports = auth;