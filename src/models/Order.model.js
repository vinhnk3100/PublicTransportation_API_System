const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderSchema = new Schema({
    order_type: {
        type: Number,
        required: true,
        enum: [1, 2]
    },
    order_status: {
        type: String,
        required: true,
        enum: ["00", "01"],
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
    },
}, { timestamps: true })

const Order = mongoose.model("Orders", OrderSchema)

module.exports = Order