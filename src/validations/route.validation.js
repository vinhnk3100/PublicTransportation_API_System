const { check } = require('express-validator');
const { handleValidationResult } = require('../utils/handleValidationResult.util');
const removeUnvalidObjectId = require("../utils/removeUnvalidObjectId.utils");
const { RouteService, VehicleService } = require('../services');

exports.createRouteValidation = [
    check("route_name")
        .exists().withMessage("Route name field can not be empty!")
        .notEmpty().withMessage("Route name field can not be empty!"),
    check("distance_length")
        .exists().withMessage("Distance field can not be empty!")
        .notEmpty().withMessage("Distance field can not be empty!"),
    check("time_start")
        .exists().withMessage("Time start field can not be empty!")
        .notEmpty().withMessage("Time start field can not be empty!"),
    check("time_start.hours")
        .exists().withMessage("Time start hours field can not be empty!")
        .notEmpty().withMessage("Time start hours field can not be empty!"),
    check("time_start.minutes")
        .exists().withMessage("Time start minutes field can not be empty!")
        .notEmpty().withMessage("Time start minutes field can not be empty!"),
    check("time_end")
        .exists().withMessage("Time end field can not be empty!")
        .notEmpty().withMessage("Time end field can not be empty!"),
    check("time_end.hours")
        .exists().withMessage("Time end hours field can not be empty!")
        .notEmpty().withMessage("Time end hours field can not be empty!"),
    check("time_end.minutes")
        .exists().withMessage("Time end minutes field can not be empty!")
        .notEmpty().withMessage("Time end minutes field can not be empty!"),
    check("stations")
        .exists().withMessage("Station field can not be empty!")
        .notEmpty().withMessage("Station field can not be empty!"),
    check("vehicles")
        .exists().withMessage("Vehicle field can not be empty!")
        .notEmpty().withMessage("Vehicle field can not be empty!"),

    (req, res, next) => handleValidationResult(req,res,next)
]

exports.filterInvalidVehicle = async (req, res, next) => {
    const { vehicles } = req.body;

    try {
        // // If Vehicle ID is invalid, this function will return undefined in Vehicle List then remove undefined from it list.
        const vehicleId = removeUnvalidObjectId.listOfItems(vehicles)

        const vehicleExist = await VehicleService.getVehicleById(vehicleId);

        const vehicleFilter = vehicleExist.filter(vehicle => { 
            return vehicle.vehicle_available === false;
        });

        // ===== Check if Vehicle is available for the next Tour
        if (!vehicleFilter || vehicleFilter.length > 0) {
            return res.json({
                success: true,
                message: "Vehicle currently unavailable",
                vehicles: vehicleFilter
            });
        }
        
        // ===== Check if in vehicles id list have an invalid ID
        if (vehicles.length - vehicleExist.length > 0) {
            return res.json({
                success: false,
                message: "Vehicles list have invalid Vehicle ID"
            })
        }

        await VehicleService.updateFilterVehicle(vehicleId);

        next();
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.filterUrlInvalidRouteId = async (req, res, next) => {
    const routeId = req.query.routeId
    try {
        const _routeId = removeUnvalidObjectId.singleItem(routeId)

        const route = await RouteService.getRouteById(_routeId);

        if (!route || route.length < 1) {
            return res.json({
                success: true,
                message: "No route found!"
            })
        }
        req.routeInvalidFiltered = route;

        next();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = this