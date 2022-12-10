// Route Controller: Get - Create - Update - Delete

const RouteModel = require("../models/Route.model");
const VehicleModel = require("../models/Vehicle.model");

// Get route
exports.get = async (req, res, next) => {
    try {
        const routes = await RouteModel.find({}).populate("vehicles").lean().exec();
        
        if (!routes || routes.length < 1) {
            return res.json({
                success: true,
                message: "No route found!"
            })
        }

        return res.json({
            success: true,
            message: "Routes found!",
            total_route: routes.length,
            routes: routes
        })
    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}

// Get route by id
exports.getById = async (req, res, next) => {
    const { routeId } = req.params

    try {
        const route = await RouteModel.findOne({ _id: routeId }).populate("vehicles").lean().exec();

        if (!route || route.length < 1) {
            return res.json({
                success: true,
                message: "No route found!"
            })
        }

        return res.json({
            success: true,
            message: "Routes found!",
            route: route
        })

    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}

// Create route
exports.create = async (req, res, next) => {
    const { route_name, distance_length, time_start, time_end, stations, vehicles } = req.body;

    try {
        // Handling when stations and vehicles empty list
        if (stations.length < 1 || vehicles.length < 1 || time_start.length < 1 || time_end.length < 1) {
            return res.json({
                success: false,
                message: "Field can not be empty"
            })
        }

        const vehicleExist = await VehicleModel.find({ _id: vehicles }).lean().exec(function (error, records) {
            records.forEach(record => {
                const vehicleInList = vehicles.filter(vehicle => {return vehicle !== record._id.toHexString()})
                console.log(vehicleInList)
            })
        })

        console.log(vehicleExist)

        // if (!vehicleExist || vehicleExist.length < 1) {
        //     return res.json({
        //         success: false,
        //         message: "Vehicles field can not be empty"
        //     })
        // } else if (vehicles.length - vehicleExist.length > 0) {
        //     const a = vehicleExist.map(vehicle => {
        //         console.log(vehicle._id)
        //     })
        //     return res.json({
        //         success: false,
        //         message: `There were random vehicle ids existed in list`
        //     })
        // }

        // const newRoute = await RouteModel.create({
        //     route_name: route_name,
        //     distance_length: distance_length,
        //     route_price: distance_length < 15 ? 5000 : distance_length < 25 ? 6000 : 7000,
        //     time_start: time_start,
        //     time_end: time_end,
        //     stations: stations,
        //     vehicles: vehicles
        // })

        // return res.json({
        //     success: true,
        //     message: "RouteController: Create Route Success!",
        //     route: newRoute
        // })
    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}

// delete route
exports.delete = async (req, res, next) => {
    const { routeId } = req.params;

    try {
        const route = await RouteModel.findByIdAndDelete({ _id: routeId })

        if (!route || route.length < 1) {
            return res.json({
                success: true,
                message: "Route not existed!"
            })
        }

        return res.json({
            success: true,
            message: `Route ${routeId} deleted!`
        })
        
    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}