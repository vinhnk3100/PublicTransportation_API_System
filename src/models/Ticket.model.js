// To-do here
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    customer_name: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    route_name: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Routes',
    },
    ticket_vehicle: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Vehicles',
    },
    ticket_price: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Routes',
    },
    is_valid: {
        required: true,
        type: Boolean,
        default: true
    }
}, {timestamps: true});

const Ticket = mongoose.model('Tickets', TicketSchema);

module.exports = Ticket;