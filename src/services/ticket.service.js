const TicketModel = require('../models/Ticket.model')
const VehicleModel = require("../models/Vehicle.model");

const getTicket = async () => {
    try {
        return await TicketModel.find({})
            .populate("customer_name", "fullname")
            .populate("route_name", "route_name")
            .populate("ticket_vehicle", "vehicles")
            .populate('ticket_price', "route_price").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createTicket = async (customer_name, route_name, ticket_vehicle, ticket_price, is_valid) => {
    try {
        return await TicketModel.create({
            customer_name: customer_name,
            route_name: route_name,
            ticket_vehicle: ticket_vehicle,
            ticket_price: ticket_price,
            is_valid: is_valid
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
            .populate("customer_name", "fullname")
            .populate("route_name", "route_name")
            .populate("ticket_vehicle", "vehicle_type")
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
    createTicket,
    updateTicket,
    updateTicketIdWithDeletedRoute,
    deleteTicket
}