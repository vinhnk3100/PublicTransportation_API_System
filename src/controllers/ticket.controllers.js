// Buy ticket - delete - update
const { TicketService, RouteService } = require('../services/index')
const { verifyToken } = require('../utils/jsonTokenGenerator.utils');
const TICKET_TYPE = require('../helpers/ticketTypes');

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
/** 
 * To selected the expired time of the ticket
 * We will selecte each ticket type
 */
exports.create = async (req, res, next) => {
    const { route_id, ticket_type } = req.body
    const { access_token } = req.headers;
    try {
        const { _id } = verifyToken(access_token);
        const route = await RouteService.getRouteById(route_id);
        if (!route || route.length < 1) {
            return res.json({
                success: false,
                message: "Route not existed!"
            })
        }
        const ticket = await TicketService.createTicket(_id, route_id, ticket_type, expiredTime);
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

// delete all tickets
exports.deleteAll = async (req, res, next) => {

    try {
        await TicketService.deleteAllTicket();
        
        return res.json({
            success: true,
            message: "Remove all tickets",
        })
    } catch (e) {
        console.log("TicketController: Delete Ticket Error: ", e);
        next(e);
    }
}

// Scanning Ticket
/** 
 * 1. Get ticket ID from query 
 * 2. Check the expired time
 * 3. Check the counting tap (check in) & type of ticket
 * 4. Check the tapping count (check in) & tapping count + 1
*/
exports.scanById = async (req, res, next) => {
    try {
        const ticketId = res.locals.ticketId
        const ticketType = res.locals.ticketType

        await TicketService.updateTicket(ticketId, { $inc: { tap_count: 1 }})

        if (ticketType === TICKET_TYPE.ONETIME_USE) {
            await TicketService.updateTicket(ticketId, { is_valid: false })
        }

        return res.render('pages/scanTicketSuccess.ejs', {
            success: true,
            message: "Ticket tapping Success"
        });
    } catch (e) {
        console.log("TicketController: Scan Ticket Error: ", e);
        next(e);
    }
}