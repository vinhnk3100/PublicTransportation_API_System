const TicketModel = require('../models/Ticket.model')

const getTicket = async () => {
    try {
        return await TicketModel.find({})
            .populate("user")
            .populate("route")
            .populate({
                path: "route",
                populate: {path: "route_agencies"}
            })
            .populate('ticket_price', "route_price")
            .lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getTicketById = async (ticketId) => {
    try {
        return await TicketModel.findById({ _id: ticketId })
            .populate("user")
            .populate("route")
            .populate('ticket_price', "route_price").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createTicket = async (userId, route_id, ticketType, ticketPrice) => {
    try {
        return await TicketModel.create({
            user: userId,
            route: route_id,
            ticket_price: ticketPrice,
            is_valid: false,
            tap_count: 0,
            ticket_expired: parseInt(ticketType) === 1 ? Date.now() + 24 * 60 * 60 * 1000 : Date.now() + 720 * 60 * 60 * 1000,
            ticket_type: parseInt(ticketType)
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const updateTicket = async (ticketId, update) => {
    try {
        return await TicketModel.findByIdAndUpdate({ _id: ticketId }, update, {
            new: true
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const updateManyTicket = async (update) => {
    try {
        return await TicketModel.updateMany(update)
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

const deleteTicket = async (ticketId) => {
    try {
        return await TicketModel.findByIdAndDelete({ _id: ticketId })
            .populate("route")
            .populate('ticket_price', "route_price").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const deleteAllTicket = async (ticketId) => {
    try {
        return await TicketModel.deleteMany();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getTicket,
    getTicketById,
    createTicket,
    updateTicket,
    updateManyTicket,
    updateTicketIdWithDeletedRoute,
    deleteTicket,
    deleteAllTicket
}