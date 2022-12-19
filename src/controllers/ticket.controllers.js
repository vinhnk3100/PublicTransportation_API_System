// Buy ticket - delete - update

const TicketModel = require('../models/Ticket.model')
const { TicketService } = require('../services/index')

// get
exports.get = async (req, res, next) => {
    try {
        const ticket = await TicketService.getTicket();

        if (!ticket || ticket.length < 1) {
            return res.json({
                success: true,
                message: "No ticket existed right now!"
            })
        }

        return res.json({
            success: true,
            message: "Tickets found!",
            total_ticket: ticket.length,
            tickets: ticket
        })
    } catch (e) {
        console.log("TicketController: Get Ticket Error: ", e);
        next(e);
    }
}

// create
exports.create = async (req, res, next) => {
    const { customer_name, route_name, ticket_vehicle, ticket_price, is_valid } = req.body
    try {
        const ticket = await TicketService.createTicket(customer_name, route_name, ticket_vehicle, ticket_price, is_valid);
        
        return res.json({
            success: true,
            message: "Ticket create!",
            ticket: ticket
        })
    } catch (e) {
        console.log("TicketController: Create Ticket Error: ", e);
        next(e);
    }
}

// delete
exports.delete = async (req, res, next) => {
    const { ticketId } = req.body;

    try {
        const ticket = await TicketService.deleteTicket(ticketId);

        return res.json({
            success: true,
            message: "Ticket delete successfully",
            ticket: ticket
        })
    } catch (e) {
        console.log("TicketController: Delete Ticket Error: ", e);
        next(e);
    }
}