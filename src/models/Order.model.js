const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderSchema = new Schema({
    order_type: {
        type: Number,
        required: true,
        enum: [1, 2]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: "Tickets",
    },
    route: {
        type: Schema.Types.ObjectId,
        ref: "Routes",
    }
    // ticket_price: {
    //     type: Number
    // }
}, {timestamps: true} )

const Order = mongoose.model("Orders", OrderSchema)

module.exports = Order