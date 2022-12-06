const mongoose = require("mongoose")

const Schema = mongoose.Schema

/**
 * Model Xe:
 * Type
 * No_Of_Seats
 * Brand
 * Model
 * Chauffeurs : Relationship with User ID
 */

const VehicleSchema = new Schema({
    vehicle_type: {
        type: String,
        default: null
    },
    vehicle_seats: {
        type: Number,
        default: null
    },
    vehicle_brand: {
        type: String,
        default: null
    },
    vehicle_model: {
        type: String,
        default: null
    },
    vehicle_chauffeur: {
        type: mongoose.Types.ObjectId, 
        ref: "Users",
    }
})

const Vehicle = mongoose.model('Vehicles', VehicleSchema);

module.exports = Vehicle;