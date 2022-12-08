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
    no_of_seats: {
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
    vehicle_mgt_unit: {
        type: Schema.Types.ObjectId, 
        ref: "Management Units",
    }
},
{ timestamps: true })

const Vehicle = mongoose.model('Vehicles', VehicleSchema);

module.exports = Vehicle;