const express = require("express");
const router = express.Router();

//Controller
const {
  setUser,
  getCurrentUser,
  updateUser,
  login,
  getUserById,
  getUserByName,
  getFriendsById,
  userFollows,
  userUnFollows,
} = require("../controllers/userControllers");

//Middleware
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidation");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");
const { dbMiddleware } = require("../middlewares/connectionBD");

//Routes
router.put(
  "/",
  authGuard,
  imageUpload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  userUpdateValidation(),
  validate,
  updateUser
);
router.post(
  "/register",
  userCreateValidation(),
  validate,
  dbMiddleware,
  setUser
);
router.post("/login", loginValidation(), validate, dbMiddleware, login);
router.get("/profile", authGuard, getCurrentUser);
router.get("/username/:userName", authGuard, getUserByName);
router.get("/friends/:userId", getFriendsById);
router.put("/follows/:userId", authGuard, userFollows);
router.put("/unfollows/:userId", authGuard, userUnFollows);
router.get("/:id", authGuard, getUserById);

module.exports = router;
