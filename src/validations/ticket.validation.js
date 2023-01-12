const mongoose = require('mongoose');
const { TicketService } = require('../services');

exports.checkTicketId = async (req, res, next) => {
    const ticketId = req.query.ticketId

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

        req.ticketId = ticketId

        next()
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = this