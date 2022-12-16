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
        default: 1,
        required: true
    },
    no_of_seats: {
        type: Number,
        required: true,
        default: null
    },
    vehicle_brand: {
        type: String,
        required: true,
        default: null
    },
    vehicle_model: {
        type: String,
        required: true,
        default: null
    },
    vehicle_available: {
        type: Boolean,
        required: true,
        default: true
    },
    vehicle_mgt_unit: {
        required: true,
        type: Schema.Types.ObjectId, 
        ref: "Management Units",
    }
},
{ timestamps: true })

const Vehicle = mongoose.model('Vehicles', VehicleSchema);

module.exports = Vehicle;