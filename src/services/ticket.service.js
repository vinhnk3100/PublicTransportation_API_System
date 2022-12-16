const TicketModel = require('../models/Ticket.model')

const getTicket = async () => {
    try {
        return await TicketModel.find({}).populate('vehicles').populate('routes').populate('users').lean().exec();
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

module.exports = {
    getTicket,
    createTicket
}