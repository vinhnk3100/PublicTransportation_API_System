// Buy ticket - delete - update

const TicketModel = require('../models/Ticket.model')
const { TicketService } = require('../services/index')

// Get
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

exports.create = async (req, res, next) => {
    const {customer_name, route_name, ticket_vehicle, ticket_price, is_valid} = req.body
    try {
        // console.log(customer_name, route_name, ticket_vehicle, ticket_price, is_valid)
        const ticket = await TicketService.createTicket(customer_name, route_name, ticket_vehicle, ticket_price, is_valid);
        
        return res.json({
            success: true,
            message: "Create ticket successfully",
            ticket: ticket
        })
    } catch (e) {
        console.log("TicketController: Create Tcket Error: ", e);
        next(e);
    }
}