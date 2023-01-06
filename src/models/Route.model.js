const mongoose = require("mongoose")

const Schema = mongoose.Schema

const RouteSchema = new Schema({
    route_number: {
        type: String,
        required: true
    },
    route_name: {
        type: String,
        required: true,
    },
    route_distance: {
        type: Number,
        required: true,
    },
    route_price: {
        type: Number,
        required: true
    },
    time_start: {
        hours: {type: Number, required: true},
        minutes: {type: Number, required: true}
    },
    time_end: {
        hours: {type: Number, required: true},
        minutes: {type: Number, required: true}
    },
    route_spacing: {
        type: String,
        required: true
    },
    total_route: {
        type: String,
        required: true
    },
    route_agencies: {
        type: Schema.Types.ObjectId,
        ref: "Management Units",
        required: true
    },
    stations: [
        {
            _id: false,
            station_name: {type: String, required: true,}
        }
    ],
    vehicles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Vehicles",
            required: true
        }
    ],
}, {timestamps: true} )

const Route = mongoose.model("Routes", RouteSchema)

module.exports = Route