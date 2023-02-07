const Router = require("express").Router()
const ticketController = require("../controllers/ticket.controllers")

const tokenValidation = require("../middlewares/auth.middleware")
const roleValidation = require("../validations/role.validation")
const ticketValidation = require("../validations/ticket.validation")

const slowDown = require("express-slow-down");

// Get all ticket
Router.get('/', ticketController.get);

// Get ticket by Id
Router.get('/:ticketId', ticketController.getById)

// Create ticket
Router.post('/create',
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    ticketController.create
);

// Delete ticket
Router.delete('/:ticketId',
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    ticketValidation.checkTicketId,
    ticketController.delete
);

// Delete all ticket
Router.delete('/',
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    ticketController.deleteAll
);

/**
 * Scanning Session
 * 1. Check ticket Id
 * 2. Check ticket valid
 * 3. Check ticket expired
 * 4. Check the counting tap (check in) & type of ticket
 */
const resetPasswordSpeedLimiter = slowDown({
    delayAfter: 1, // allow 5 requests to go at full-speed, then...
    delayMs: 1000 // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
  });

Router.get('/scan/:ticketId',
    resetPasswordSpeedLimiter,
    ticketValidation.checkTicketId,
    ticketValidation.checkTicketExpired,
    ticketValidation.checkTicketTypeAndTapCount,
    ticketValidation.checkValidTicket,
    ticketController.scanById
)

module.exports = Router;