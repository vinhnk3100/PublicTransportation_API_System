// Route Controller: Get - Create - Update - Delete

const RouteModel = require("../models/Route.model")

// Get route
exports.get = async (req, res, next) => {
    try {
        const route = await RouteModel.find({}).populate("vehicles").lean().exec();

        if (!route || route.length < 1) {
            return res.json({
                success: true,
                message: "No route found!"
            })
        }

        return res.json({
            success: true,
            message: "Routes found!",
            total_route: route.length,
            routes: route
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
        const newRoute = await RouteModel.create({
            route_name: route_name,
            distance_length: distance_length,
            time_start: time_start,
            time_end: time_end,
            stations: stations,
            vehicles: vehicles
        })

        return res.json({
            success: true,
            message: "RouteController: Create Route Success!",
            route: newRoute
        })
    } catch (error) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}