const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {feedposts, posts, deleteposts, likeposts, updateposts, createposts } = require("../controllers/posts")

router.get("/feedposts", auth, feedposts)

router.get("/", auth, posts);

router.post("/", auth, createposts);

router.patch("/:id", auth, updateposts); 

router.delete("/:id", auth, deleteposts);

router.patch("/:id/updatelikes", auth, likeposts);

module.exports = router;