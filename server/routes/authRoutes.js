const express = require("express");
const router = express.Router();

//Controller
const {
  setPost,
  updatePost,
  deletePost,
  likePost,
  getPosts,
  getAllPosts,
} = require("../controllers/postControllers");

//Middleware

//Routes
router.post("/newPost", setPost);
router.put("/updatePost/:id", updatePost);
router.delete("/deletePost/:id", deletePost);
router.put("/:id/likes", likePost);
router.get("/:id", getPosts);
router.get("/timeline/:userId", getAllPosts);

module.exports = router;
