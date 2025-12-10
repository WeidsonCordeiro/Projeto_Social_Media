const express = require("express");
const router = express.Router();

//Controller
const {
  setPost,
  updatePost,
  deletePost,
  likePost,
  getPosts,
  getAlltPosts,
} = require("../controllers/postControllers");

//Middleware

//Routes
router.post("/newPost", setPost);
router.put("/updatePost/:id", updatePost);
router.delete("/deletePost/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/:id", getPosts);
router.get("/timeline/:userId", getAlltPosts);

module.exports = router;
