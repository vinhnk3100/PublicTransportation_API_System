const Router = require("express").Router();
const roleValidation = require("../validations/role.validation")
const userController = require("../controllers/user.controller")

// Get all user
Router.get('/', roleValidation.admin, userController.get)

// Create User (Admin create Staff)

// Update User

// Delete User

module.exports = Router