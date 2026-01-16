const express = require("express");
const router = express.Router();

//Controller
const {
  setPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getPosts,
  getAllPostsByUserId,
  getAllPostsByUserName,
} = require("../controllers/postControllers");

//Middleware
const autGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");
const {
  postPhotoInsertValidation,
  postPhotoUpdateValidation,
  postCommentValidation,
} = require("../middlewares/postPhotoValidation");

//Routes
router.post(
  "/register",
  autGuard,
  imageUpload.single("img"),
  postPhotoInsertValidation(),
  validate,
  setPost
);
router.put("/:id", autGuard, postPhotoUpdateValidation(), validate, updatePost);
router.delete("/:id", autGuard, deletePost);
router.put("/likes/:id", autGuard, validate, likePost);
router.get("/:id", autGuard, validate, getPosts);
router.get("/timeline/:userId", autGuard, validate, getAllPostsByUserId);
router.get("/profile/:userName", autGuard, validate, getAllPostsByUserName);
router.put(
  "/comment/:id",
  autGuard,
  postCommentValidation(),
  validate,
  commentPost
);

module.exports = router;
