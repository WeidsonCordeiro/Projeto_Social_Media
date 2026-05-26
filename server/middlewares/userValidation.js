const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("The name is required!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("The name must have at least 3 characters!"),
    body("email")
      .notEmpty()
      .withMessage("The Email is required!")
      .bail()
      .isEmail()
      .withMessage("Email invalid!"),
    body("password")
      .notEmpty()
      .withMessage("The password is required!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("The password must have at least 6 characters!"),
    body("confirmPassword")
      .isString()
      .withMessage("Password confirmation is required!")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("The passwords are not the same!");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("The Email is required!")
      .bail()
      .isEmail()
      .withMessage("Email invalid!"),
    body("password")
      .notEmpty()
      .withMessage("The password is required!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("The password must have at least 6 characters!"),
  ];
};

const userUpdateValidation = () => {
  return [
    body("username")
      .optional()
      .isLength({ min: 3 })
      .withMessage("The name must have at least 3 characters!"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("The password must have at least 6 characters!"),
    body("profilePicture").optional(),
    body("coverPicture").optional(),
    body("description")
      .optional()
      .isLength({ min: 6 })
      .withMessage("The description must have at least 6 characters!"),
    body("city")
      .optional()
      .isString()
      .withMessage("The city must be a string!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("The city must have at least 6 characters!"),
    body("from")
      .optional()
      .isString()
      .withMessage("The origin location must be a string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("The password must have at least 3 characters!"),
    body("relationship")
      .optional()
      .isNumeric()
      .withMessage("Marital status should be a number!"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
