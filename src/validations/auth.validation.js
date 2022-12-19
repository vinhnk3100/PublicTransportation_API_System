const { check } = require('express-validator');
const { handleValidationResult } = require('../utils/handleValidationResult.util');

exports.loginValidation = [
    check("username")
        .exists().withMessage("Input your username!")
        .notEmpty().withMessage("Input your username!"),
    check("password")
        .exists().withMessage("Input your password!")
        .notEmpty().withMessage("Input your password!"),
    (req, res, next) => handleValidationResult(req,res,next)
]

exports.registerValidation = [
    check("username")
        .exists().withMessage("Input your username!")
        .notEmpty().withMessage("Input your username!"),
    check("fullname")
        .exists().withMessage("Input your fullname!")
        .notEmpty().withMessage("Input your fullname!"),
    check("password")
        .exists().withMessage("Input your password!")
        .notEmpty().withMessage("Input your password!"),
    check("phoneNumber")
        .exists().withMessage("Input your phone number!")
        .notEmpty().withMessage("Input your phone number!"),
    (req, res, next) => handleValidationResult(req,res,next)
]

module.exports = this