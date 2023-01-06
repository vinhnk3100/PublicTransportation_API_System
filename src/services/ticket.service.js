const TicketModel = require('../models/Ticket.model')

const getTicket = async () => {
    try {
        return await TicketModel.find({})
            .populate("route_name", "route_name")
            .populate('ticket_price', "route_price").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getTicketById = async (ticketId) => {
    try {
        return await TicketModel.findById( {_id: ticketId })
            .populate("route_name", "route_name")
            .populate('ticket_price', "route_price").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createTicket = async (fullname, route_id) => {
    try {
        return await TicketModel.create({
            customer_name: fullname,
            route_name: route_id,
            ticket_price: route_id,
            is_valid: true,
            ticket_expired: Date.now()
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const updateTicket = async(ticketId, update) => {
    try {
        return await TicketModel.findByIdAndUpdate({ _id: ticketId }, update, {
            new: true
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const deleteTicket = async (ticketId) => {
    try {
        return await TicketModel.findByIdAndDelete({ _id: ticketId })
            .populate("route_name", "route_name")
            .populate('ticket_price', "route_price").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

// Update list of ticketID same with Route ID when route is deleted
const updateTicketIdWithDeletedRoute = async (listOfTicketId) => {
    try {
        return await TicketModel.updateMany({ _id: listOfTicketId }, {
            is_valid: false
        }, { new: true });
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getTicket,
    getTicketById,
    createTicket,
    updateTicket,
    updateTicketIdWithDeletedRoute,
    deleteTicket
}