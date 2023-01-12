const mongoose = require('mongoose')
const { check } = require('express-validator')
const TICKET_TYPE = require('../helpers/ticketTypes')
const { RouteService, VehicleService } = require('../services')
const removeUnvalidObjectId = require("../utils/removeUnvalidObjectId.utils")
const { handleValidationResult } = require('../utils/handleValidationResult.util')

exports.createRouteValidation = [
    check("route_name")
        .exists().withMessage("Route name field can not be empty!")
        .notEmpty().withMessage("Route name field can not be empty!"),
    check("route_distance")
        .exists().withMessage("Distance field can not be empty!")
        .notEmpty().withMessage("Distance field can not be empty!"),
    check("time_start")
        .exists().withMessage("Time start field can not be empty!")
        .notEmpty().withMessage("Time start field can not be empty!"),
    check("time_start.hours")
        .exists().withMessage("Time start hours field can not be empty!")
        .notEmpty().withMessage("Time start hours field can not be empty!")
        .custom((value) => {
            if (value < 6 || value > 12) throw new Error('Time start hours route can only from 6AM to 12PM!')
        }),
    check("time_start.minutes")
        .exists().withMessage("Time start minutes field can not be empty!")
        .notEmpty().withMessage("Time start minutes field can not be empty!")
        .custom((value) => {
            if (value < 0 || value > 59) throw new Error('Minutes can only from 0 to 59!')
        }),
    check("time_end")
        .exists().withMessage("Time end field can not be empty!")
        .notEmpty().withMessage("Time end field can not be empty!"),
    check("time_end.hours")
        .exists().withMessage("Time end hours field can not be empty!")
        .notEmpty().withMessage("Time end hours field can not be empty!")
        .custom((value) => {
            if (value < 12 || value > 21) throw new Error('Time end hours route is from 12PM to 21PM!')
        }),
    check("time_end.minutes")
        .exists().withMessage("Time end minutes field can not be empty!")
        .notEmpty().withMessage("Time end minutes field can not be empty!")
        .custom((value) => {
            if (value < 0 || value > 59) throw new Error('Minutes can only from 0 to 59!')
        }),
    check("route_number")
        .exists().withMessage("Route number field can not be empty!")
        .notEmpty().withMessage("Route number field can not be empty!"),
    check("route_spacing")
        .exists().withMessage("Route spacing field can not be empty!")
        .notEmpty().withMessage("Route spacing field can not be empty!"),
    check("total_route")
        .exists().withMessage("Total route field can not be empty!")
        .notEmpty().withMessage("Total route field can not be empty!"),
    check("route_agencies")
        .exists().withMessage("Route agencies field can not be empty!")
        .notEmpty().withMessage("Route agencies field can not be empty!"),
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

        // ===== Check if Vehicle is available for the next Tour
        const vehicleFilter = vehicleExist.filter(vehicle => { 
            return vehicle.vehicle_available === false;
        });

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

        await VehicleService.updateFilterVehicle(vehicleId, {"vehicle_available": false,});

        next();
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.filterUrlInvalidRouteId = async (req, res, next) => {
    const routeId = req.query.routeId
    const ticket_type = req.query.ticketType
    try {
        if (!routeId || !mongoose.isValidObjectId(routeId)) {
            return res.json({
                success: true,
                message: "Invalid Route Id"
            })
        }

        if (!ticket_type || parseInt(ticket_type) !== TICKET_TYPE.ONETIME_USE && parseInt(ticket_type) !== TICKET_TYPE.MONTH_USE) {
            return res.json({
                success: true,
                message: "Invalid type for ticket"
            })
        }

        const route = await RouteService.getRouteById(routeId);

        if (!route || route.length < 1) {
            return res.json({
                success: true,
                message: "No route found!"
            })
        }
        
        req.routeInvalidFiltered = routeId;
        req.ticketType = ticket_type;

        next();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = this