const express = require("express");
const router = express.Router();

//Controller
const {
  setUser,
  getCurrentUser,
  updateUser,
  login,
  getUserById,
} = require("../controllers/userControllers");

//Middleware
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidation");
const authGuard = require("../middlewares/authGuard");

//Routes
router.post("/register", userCreateValidation(), validate, setUser);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put("/", authGuard, userUpdateValidation(), validate, updateUser);
router.get("/:id", authGuard, getUserById);

module.exports = router;

/*
//Controller
const { register, login, getCurrentUser, update, getUserById } = require('../controllers/UserController');

//Middleware
const validate = require('../middlewares/handleValidation');
const { userCreateValidation, loginValidation, userUpdateValidation } = require('../middlewares/userValidation');
const authGuard = require('../middlewares/authGuard');
const { imageUpload } = require('../middlewares/imageUpload');

//Routes
router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);
router.get('/profile', authGuard, getCurrentUser);
router.put('/', authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), update);
router.get('/:id', authGuard, getUserById);

*/
