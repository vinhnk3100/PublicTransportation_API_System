
const VEHICLE_TYPE = require("../helpers/vehicleTypes");
const VehicleModel = require("../models/Vehicle.model");

const getVehicle = async () => {
    try {
        return await VehicleModel.find({}).populate("vehicle_mgt_unit").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getVehicleById = async (vehicleId) => {
    try {
        return await VehicleModel.find({ _id: vehicleId }).populate("vehicle_mgt_unit").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getAvailable = async (vehicleIdQuery, findFilter, findFilterId) => {
    try {
        return await VehicleModel.find(vehicleIdQuery === undefined ? findFilter : findFilterId).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createVehicle = async (vehicle_type, no_of_seats, vehicle_brand, vehicle_model, vehicle_mgt_unit) => {
    try {
        return await VehicleModel.create({
            vehicle_type: parseInt(vehicle_type) === 1 ? VEHICLE_TYPE.BUS : VEHICLE_TYPE.BUS,
            no_of_seats: no_of_seats,
            vehicle_brand: vehicle_brand,
            vehicle_model: vehicle_model,
            vehicle_mgt_unit: vehicle_mgt_unit
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const updateVehicle = async (vehicleId, update) => {
    try {
        return await VehicleModel.findByIdAndUpdate({ _id: vehicleId }, update, { new: true }).exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

// Update vehicle on Filtering Route action (Utilities for updating)
const updateFilterVehicle = async (vehicleId, update) => {
    try {
        return await VehicleModel.updateMany({ _id: vehicleId }, update, { new: true }).exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const updateManyVehicle = async (update) => {
    try {
        return await VehicleModel.updateMany(update)
    } catch (e) {
        throw new Error(e.message)
    }
}

const deleteVehicle = async (vehicleId) => {
    try {
        return await VehicleModel.findByIdAndDelete({ _id: vehicleId });
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports = {
    getVehicle,
    getVehicleById,
    getAvailable,
    createVehicle,
    updateVehicle,
    updateManyVehicle,
    updateFilterVehicle,
    deleteVehicle
}