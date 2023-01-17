const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderSchema = new Schema({
    status: {
        type: Boolean,
        required: true
    },
    order_type: {
        type: Number,
        required: true,
        enum: [1, 2]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: "Tickets",
        required: true
    },
    ticket_price: {
        type: Schema.Types.ObjectId,
        ref: "Tickets",
        required: true
    }
}, {timestamps: true} )

const Order = mongoose.model("Orders", OrderSchema)

module.exports = Order