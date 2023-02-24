const mongoose = require('mongoose');
const { TicketService } = require('../services');
const TICKET_TYPE = require('../helpers/ticketTypes');

// This to check if user is using browser only
exports.checkUserAgent = async (req, res, next) => {
    try {
        const userAgent = req.headers['user-agent']

        // If user using _zaloBot scanner
        if (userAgent?.includes("_zbot")) {
            console.log("User is Bot")
            return res.render('pages/scanTicketFalse', {
                success: false,
                message: "Failed to scan ticket"
            });
        }
        
        // Detect if User not using Browser
        if(!userAgent.match(/chrome|chromium|crios/i|/firefox|fxios/i|/safari/i|/opr\//i|/edg/i)){
            console.log("Detected User not using Browser")
            return res.render('pages/scanTicketFalse', {
                success: false,
                message: "Failed to scan ticket"
            });
          }

        console.log("Pass to another validation")
        next()
    } catch (e) {
        throw new Error(e.message)
    }
}

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
        
        res.locals.ticketType = ticket.ticket_type
        
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
            return res.render('pages/scanTicketFalse', {
                success: false,
                message: "Ticket is Expired"
            });
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