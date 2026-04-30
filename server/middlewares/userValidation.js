const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("O nome é obrigatório!")
      .bail()
      .isString()
      .withMessage("O nome deve ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O nome deve ter pelo menos 3 caracteres!"),
    body("email")
      .notEmpty()
      .withMessage("O e-mail é obrigatório!")
      .bail()
      .isEmail()
      .withMessage("E-mail inválido!"),
    body("password")
      .notEmpty()
      .withMessage("A senha é obrigatória!")
      .bail()
      .isString()
      .withMessage("A senha deve ser uma string!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória!")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("As senhas não são iguais!");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("O e-mail é obrigatório!")
      .bail()
      .isString()
      .withMessage("O e-mail deve ser uma string!")
      .bail()
      .isEmail()
      .withMessage("E-mail inválido!"),
    body("password")
      .notEmpty()
      .withMessage("A senha é obrigatória!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
  ];
};

const userUpdateValidation = () => {
  return [
    body("username")
      .optional()
      .isString()
      .withMessage("O nome deve ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O nome deve ter pelo menos 3 caracteres!"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("profilePicture").optional(),
    body("coverPicture").optional(),
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição deve ser uma string!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("city")
      .optional()
      .isString()
      .withMessage("A cidade deve ser uma string!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("from")
      .optional()
      .isString()
      .withMessage("O local de origem deve ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("A senha deve ter pelo menos 3 caracteres!"),
    body("relationship")
      .optional()
      .isNumeric()
      .withMessage("O estado civil deve ser um numero!"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
