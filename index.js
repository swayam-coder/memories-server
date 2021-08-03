const express = require("express");
const cors = require("cors");
const createErrors = require("http-errors");
const PORT = 5000;

const postRoutes = require("./routes/posts.js");  // dont forget to add the .js extention as it is important in node
const userRoutes = require("./routes/user.js"); 

const app = express();

app.use(cors());
app.use(express.json({limit: '30mb', extended: "true"}));  // extended: true allows jsonifying nested objects
app.use(express.urlencoded({limit: '30mb', extended: "true"}));


app.use("/posts", postRoutes);  // always define routes after cors middleware
app.use("/auth", userRoutes);

app.use(async (req, res, next) => {
    next(createErrors.NotFound("Page not found"))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)   // 500 is a generic error so if nothing, then 500
    res.send({
        status: err.status || 500,
        message: err.message
    })
})

require("./db/connection.js"); 

app.listen(5000, (req, res) => {
    console.log("server running at port 5000");
});