// Vehicle Controller: Get - Create - Update - Delete

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

// Get vehicle by id
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

// create
exports.create = async (req, res, next) => {
    const { vehicle_type, no_of_seats, vehicle_brand, vehicle_model, vehicle_mgt_unit } = req.body;
    try {
        const newVehicle = await VehicleModel.create({
            vehicle_type: vehicle_type, 
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

    } catch (error) {
        console.log("ERR: Create Vehicle Error: ", e);
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