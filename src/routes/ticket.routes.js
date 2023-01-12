const Router = require("express").Router()
const roleValidation = require("../validations/role.validation")
const ticketValidation = require("../validations/ticket.validation")
const ticketController = require("../controllers/ticket.controllers")

// Get all ticket
Router.get('/', ticketController.get);

// Get ticket by Id
Router.get('/:ticketId', ticketController.getById)

// Create ticket
Router.post('/create', roleValidation.admin, ticketController.create);

// Delete ticket
Router.delete('/:ticketId', roleValidation.admin, ticketController.delete);

/**
 * Scanning Session
 * 1. Check ticket Id
 * 2. Check ticket valid
 * 3. Check ticket expired
 * 4. Check the counting tap (check in) & type of ticket
 */
Router.get('/scan/:ticketId',
    ticketValidation.checkTicketId,
    ticketValidation.checkValidTicket,
    ticketValidation.checkTicketExpired,
    ticketValidation.checkTicketTypeAndTapCount,
    ticketController.scanById
)

module.exports = Router;