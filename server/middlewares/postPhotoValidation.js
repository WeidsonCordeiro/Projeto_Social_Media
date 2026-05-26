const { body } = require("express-validator");

const postPhotoInsertValidation = () => {
  return [
    body("description")
      .notEmpty()
      .withMessage("The description is required!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("The description must have at least 3 characters!"),
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
      .isLength({ min: 3 })
      .withMessage("The description must have at least 3 characters!"),
  ];
};

const postCommentValidation = () => {
  return [
    body("comments")
      .optional()
      .isLength({ min: 3 })
      .withMessage("The comments must have at least 6 characters!"),
  ];
};

module.exports = {
  postPhotoInsertValidation,
  postPhotoUpdateValidation,
  postCommentValidation,
};
