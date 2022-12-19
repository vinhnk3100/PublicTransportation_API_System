const Router = require("express").Router();
const authController = require("../controllers/auth.controllers")
const authValidation = require("../validations/auth.validation")
const checkDuplicateRegister = require("../utils/checkDuplicateRegister.util")

Router.post('/login', authValidation.loginValidation, authController.login);

Router.post('/register', authValidation.registerValidation, checkDuplicateRegister.register, authController.register);

module.exports = Router