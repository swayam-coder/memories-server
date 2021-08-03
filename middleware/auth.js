const jwt = require("jsonwebtoken");
const createErrors = require("http-errors");

const secret = process.env.ACCESS_TOKEN_SECRET;

const auth = async (req, res, next) => {
  try {
    // if(!req.headers.authorization) return 

    const Accesstoken = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;  // if length is less than 500 then token is custom

    let decodedData;

    if (token && isCustomAuth) {      // if the token is custom token
      jwt.verify(Accesstoken, secret, (err, payload) => {
        if(err) {
          const errormsg = (err.name === "JsonWebTokenError") ? "Unauthorized User" : err.message;
          next(createErrors.Unauthorized(errormsg))  // if token would have expired
        }
        req.userId = payload.id;
        next();
      })
    } else {                          // if the token is oauth token
      jwt.decode(Accesstoken, (err, payload) => {
        if(err) {
          const errormsg = (err.name === "JsonWebTokenError") ? "Unauthorized User" : err.message;
          next(createErrors.Unauthorized(errormsg));
        }
        req.userId = payload.sub;
        next();
      })
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;