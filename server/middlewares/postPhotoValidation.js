const { body } = require("express-validator");

const postPhotoInsertValidation = () => {
  return [
    body("description")
      .not()
      .equals("undefined")
      .withMessage("A descrição é obrigatória!")
      .bail()
      .isString()
      .withMessage("A descrição tem que ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("A descrição deve ter pelo menos 3 caracteres!"),
    // body("img").custom((value, { req }) => {
    //   if (!req.file) {
    //     throw new Error("A imagem é obrigatória!");
    //   }
    //   return true;
    // }),
  ];
};

const postPhotoUpdateValidation = () => {
  return [
    body("description")
      .optional()
      .isString()
      .withMessage("A descrição tem que ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O descrição deve ter pelo menos 3 caracteres!"),
  ];
};

const postCommentValidation = () => {
  return [
    body("comments")
      .isString()
      .withMessage("O comentário tem que ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O comentário deve ter pelo menos 3 caracteres!"),
  ];
};

module.exports = {
  postPhotoInsertValidation,
  postPhotoUpdateValidation,
  postCommentValidation,
};
