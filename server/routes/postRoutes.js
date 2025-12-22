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
router.post("/register", setPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/likes", likePost);
router.get("/:id", getPosts);
router.get("/timeline/:userId", getAllPosts);

module.exports = router;
