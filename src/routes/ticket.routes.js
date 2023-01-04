const Router = require("express").Router();
const roleValidation = require("../validations/role.validation");
const ticketController = require("../controllers/ticket.controllers")

// Get all ticket
Router.get('/', ticketController.get);

// Get ticket by Id
Router.get('/:ticketId', ticketController.getById)

// Create ticket
Router.post('/create', roleValidation.admin, ticketController.create);

// Delete ticket
Router.delete('/:ticketId', roleValidation.admin, ticketController.delete);

module.exports = Router;