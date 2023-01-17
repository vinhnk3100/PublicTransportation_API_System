const { validationResult } = require('express-validator');

exports.handleValidationResult = (req, res, next) => {
  const { errors } = validationResult(req);
  // if has error
  if (errors.length > 0) {
    console.log('ERR: Handle Validation Result: ', errors);

    return res.status(400).json({
      success: false,
      message: "Handle Validation: " + errors[0].msg,
    });
  }
  next();
};
