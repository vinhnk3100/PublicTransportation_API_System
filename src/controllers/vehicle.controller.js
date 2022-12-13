// Vehicle Controller: Get - Create - Update - Delete

const VEHICLE_TYPE = require("../helpers/vehicleTypes")
const VehicleModel = require("../models/Vehicle.model");

// get
exports.get = async (req, res, next) => {
    try {
        const vehicle = await VehicleModel.find({}).populate("vehicle_mgt_unit").lean().exec();
        if (!vehicle || vehicle.length < 1) {
            return res.json({
                success: true,
                message: "No vehicle existed!"
            })
        }

        return res.json({
            success: true,
            message: "Vehicles found!",
            total_vehicle: vehicle.length,
            vehicles: vehicle
        })
    } catch (e) {
        console.log("ERR: Create Vehicle Error: ", e);
        next(e);
    }
}

// Get by id
exports.getById = async (req, res, next) => {
    const { vehicleId } = req.params;
    try {
        const vehicle = await VehicleModel.findOne({ _id: vehicleId }).populate("vehicle_mgt_unit").lean().exec();
        
        if (!vehicle || vehicle.length < 1) {
            return res.json({
                success: true,
                message: "No vehicle existed!"
            })
        }

        return res.json({
            success: true,
            message: "Vehicles found!",
            vehicle: vehicle
        })
    } catch (e) {
        console.log("ERR: Create Vehicle Error: ", e);
        next(e);
    }
}

// Search available
exports.getAvailable = async (req, res, next) => {
    try {
        const findFilterId = {
            "vehicle_available": req.query.available,
            _id: req.query.vehicleId
        }

        const findFilter = {
            "vehicle_available": req.query.available,
        }

        const availableVehicles = await VehicleModel.find(req.query.vehicleId === undefined ? findFilter : findFilterId).lean().exec();

        if (!availableVehicles || availableVehicles.length < 1) {
            return res.json({
                success: false,
                message: "There is no available vehicle at current"
            })
        }

        return res.json({
            success: true,
            vehicle_available: availableVehicles
        })
    } catch (e) {
        console.log("ERR: Search Vehicle Error: ", e);
        next(e);
    }
}

// create
exports.create = async (req, res, next) => {
    const { vehicle_type, no_of_seats, vehicle_brand, vehicle_model, vehicle_mgt_unit } = req.body;

    try {
        const newVehicle = await VehicleModel.create({
            vehicle_type: parseInt(vehicle_type) === 1 ? VEHICLE_TYPE.BUS : parseInt(vehicle_type) === 2 ? VEHICLE_TYPE.TRAIN : VEHICLE_TYPE.SUBWAY,
            no_of_seats: no_of_seats,
            vehicle_brand: vehicle_brand,
            vehicle_model: vehicle_model,
            vehicle_mgt_unit: vehicle_mgt_unit
        })

        return res.json({
            success: true,
            message: "VehicleController: Create Vehicle Success!",
            vehicle: newVehicle
        })

    } catch (e) {
        console.log("ERR: Create Vehicle Error: ", e);
        next(e);
    }
}

// update
exports.update = async (req, res, next) => {
    const { vehicleId } = req.params;
    const update = req.body;

    try {
        let updateVehicle = await VehicleModel.findByIdAndUpdate({ _id: vehicleId }, update, { new: true }).exec();

        if (!updateVehicle || updateVehicle.length < 1) {
            return res.json({
                success: false,
                message: "No vehicle existed!"
            })
        }

        return res.json({
            success: true,
            message: `Vehicle ${vehicleId} updated`,
            vehicle: updateVehicle
        })
        
    } catch (e) {
        console.log("ERR: Update Vehicle Error: ", e);
        next(e);
    }
}

// delete
exports.delete = async (req, res, next) => {
    const { vehicleId } = req.params;

    try {
        const vehicle = await VehicleModel.findByIdAndDelete({ _id: vehicleId })

        if (!vehicle || vehicle.length < 1) {
            return res.json({
                success: false,
                message: "Vehicle not existed!"
            })
        }

        return res.json({
            success: true,
            message: `Vehicle ${vehicleId} deleted!`
        })
    } catch (e) {
        console.log("ERR: Create Vehicle Error: ", e);
        next(e);
    }
}