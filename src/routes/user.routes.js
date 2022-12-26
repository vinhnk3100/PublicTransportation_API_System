const Router = require("express").Router();
const roleValidation = require("../validations/role.validation");
const userController = require("../controllers/user.controller");
const authValidation = require("../validations/auth.validation");
const routeValidation = require("../validations/route.validation");

// Get all user
Router.get('/', roleValidation.admin, userController.get);

// Get user by uid
Router.get('/:userId', roleValidation.admin, userController.getById)

// Create User (Admin)
Router.post('/create', roleValidation.admin, authValidation.registerValidation, userController.create);

// Update User
Router.put('/:userId', userController.update);

// Delete User
Router.delete('/:userId', roleValidation.admin, userController.delete);

// ========================================== Utilities Sections ==========================================

// Buy Ticket
Router.post('/buy-ticket',
    routeValidation.filterUrlInvalidRouteId,
    userController.buyTicket
);

module.exports = Router;