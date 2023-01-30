// To-do here
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    // customer_name: {
    //     required: true,
    //     type: String,
    //     ref: 'Users',
    // },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Users',   
    },
    route: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Routes',
    },
    ticket_price: {
        required: true,
        type: Number,
    },
    is_valid: {
        required: true,
        type: Boolean,
        default: true
    },
    ticket_type: {
        required: true,
        type: Number,
        enum: [1, 2]
    },
    tap_count: {
        required: true,
        type: Number
    },
    ticket_expired: {
        required: true,
        type: Number
    },
    qr_code: {
        type: String
    }
}, {timestamps: true});

const Ticket = mongoose.model('Tickets', TicketSchema);

module.exports = Ticket;