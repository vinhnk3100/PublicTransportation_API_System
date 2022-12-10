const Router = require("express").Router();
const roleValidation = require("../validations/role.validation");
const userController = require("../controllers/user.controller");

// Get all user
Router.get('/', roleValidation.staff, userController.get);

// Create User (Admin create Staff)
Router.post('/create', roleValidation.admin, userController.create);

// Update User
Router.put('/:userId', userController.update);

// Delete User
Router.delete('/:userId', roleValidation.admin, userController.delete);

module.exports = Router;