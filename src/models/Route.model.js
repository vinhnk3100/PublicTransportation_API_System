const mongoose = require("mongoose")

const Schema = mongoose.Schema

const RouteSchema = new Schema({
    route_start: {
        type: String,
        required: true,
    },
    route_end: {
        type: String,
        required: true,
    },
    timeStart: {
        type: Date, 
        required: true,
    },
    timeEnd: {
        type: Date, 
        required: true,
    },
    vehicle: {
        type: mongoose.Types.ObjectId, 
        ref: "Vehicles",
    }
})

const Route = mongoose.model("Routes", RouteSchema)

module.exports = Route