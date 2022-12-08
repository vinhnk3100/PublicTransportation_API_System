const mongoose = require("mongoose")

const Schema = mongoose.Schema

const RouteSchema = new Schema({
    route_name: {
        type: String,
        required: true,
    },
    distance_length: {
        type: Number,
        required: true,
    },
    time_start: {
        type: String, 
        required: true,
    },
    time_end: {
        type: String, 
        required: true,
    },
    stations: [
        {
            _id: false,
            station_name: {type: String, required: true,}
        }
    ],
    vehicles: [{type: Schema.Types.ObjectId, ref: "Vehicles"}],
}, {timestamps: true} )

const Route = mongoose.model("Routes", RouteSchema)

module.exports = Route