const mongoose = require('mongoose');
const { TicketService } = require('../services');
const TICKET_TYPE = require('../helpers/ticketTypes');

exports.checkTicketId = async (req, res, next) => {
    const { ticketId } = req.params

    try {
        if (!ticketId || !mongoose.isValidObjectId(ticketId)) {
            return res.json({
                success: false,
                message: "Invalid ticket ID"
            })
        }

        const ticket = await TicketService.getTicketById(ticketId)

        if (!ticket || ticket.length < 1) {
            return res.json({
                success: false,
                message: "Ticket not found"
            })
        }

        res.locals.ticket = ticket
        res.locals.ticketId = ticketId

        next()
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.checkValidTicket = async (req, res, next) => {
    const ticket = res.locals.ticket
    try {
        if (!ticket.is_valid) {
            return res.render('pages/scanTicketFalse', {
                success: false,
                message: "Ticket is Invalid"
            });
        }

        next()
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.checkTicketExpired = async (req, res, next) => {
    const ticket = res.locals.ticket

    try {
        const date = Date.now()
        const expiredDate = Math.floor((ticket.ticket_expired - date)/ 1000)
        if (expiredDate <= 0) {
            return res.json({
                success: false,
                message: "Ticket expired"
            })
        }
        
        next()
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.checkTicketTypeAndTapCount = async (req, res, next) => {
    const ticket = res.locals.ticket
    const ticketId = res.locals.ticketId

    try {
        if (ticket.ticket_type === TICKET_TYPE.ONETIME_USE && ticket.tap_count >= 1) {
            await TicketService.updateTicket(ticketId, { is_valid: false })
            return res.render('pages/scanTicketFalse', {
                success: false,
                message: "Ticket is Invalid"
            });
        }
    
        if (ticket.ticket_type === TICKET_TYPE.MONTH_USE && ticket.tap_count >= 30) {
            await TicketService.updateTicket(ticketId, { is_valid: false })
            return res.render('pages/scanTicketFalse', {
                success: false,
                message: "Ticket is Invalid"
            });
        }
    
        next()
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = this