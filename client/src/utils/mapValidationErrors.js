export const mapValidationErrors = (errors) => {
  const errorsObj = {};

  errors.forEach((err) => {
    errorsObj[err.field] = err.message;
  });

  return errorsObj;
};
