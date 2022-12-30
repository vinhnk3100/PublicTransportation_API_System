// Buy ticket - delete - update
const { TicketService, RouteService } = require('../services/index')
const { verifyToken } = require('../utils/jsonTokenGenerator.utils');

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

// get by id
exports.getById = async (req, res, next) => {
    const { ticketId } = req.params;
    try {
        const ticket = await TicketService.getTicketById(ticketId);

        if (!ticket || ticket.length < 1) {
            return res.json({
                success: false,
                message: 'Ticket not existed!'
            })
        }

        return res.json({
            success: true,
            message: 'Ticket found!',
            data: ticket
        })
    } catch (e) {
        console.log("TicketController: Get Ticket ID Error: ", e);
        next(e);
    }
}

// create
exports.create = async (req, res, next) => {
    const { route_id } = req.body
    const { access_token } = req.headers;
    try {
        const { fullname } = verifyToken(access_token);
        const route = await RouteService.getRouteById(route_id);
        if (!route || route.length < 1) {
            return res.json({
                success: false,
                message: "Route not existed!"
            })
        }
        const ticket = await TicketService.createTicket(fullname, route_id);
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
    const { ticketId } = req.params;

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

// ========================================= Utilities ===============================================
// Check valid ticket - For scanning purpose on bus
exports.isvalid = async (req, res, next) => {
    const { ticketId } = req.params
    try {
        const ticket = await TicketService.getTicketById(ticketId);

        if (!ticket || ticket.length < 1) {
            return res.json({
                success: true,
                message: 'Invalid ticket'
            })
        }
    } catch (error) {
        
    }
}