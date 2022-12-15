// Buy ticket - delete - update

const TicketModel = require('../models/Ticket.model')

// Get
exports.get = async (req, res, next) => {
    try {
        const ticket = await TicketModel.find({}).lean().exec();

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
        console.log("TicketController: Get Tcket Error: ", e);
        next(e);
    }
}