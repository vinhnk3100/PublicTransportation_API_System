// Route Controller: Get - Create - Update - Delete
const VehicleModel = require("../models/Vehicle.model");
const { RouteService } = require('../services/index');

// Get route
exports.get = async (req, res, next) => {
    try {
        // Query Database Services
        const routes = await RouteService.getRoute()
        
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
        // Query Database Services
        const route = await RouteService.getRouteById(routeId)

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
        // Query Database Services
        const newRoute = await RouteService.createRoute(route_name, distance_length, time_start, time_end, stations, vehicles);

        return res.json({
            success: true,
            message: "RouteController: Create Route Success!",
            route: newRoute,
        })
    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}

// delete route
exports.delete = async (req, res, next) => {
    const { routeId } = req.params;

    try {
        // Query Database Services
        const routes = await RouteService.getRouteById(routeId);
        
        if (!routes || routes.length < 1) {
            return res.json({
                success: true,
                message: "Route not existed!"
            });
        };

        routes.forEach(async (x) => {
            await VehicleModel.updateMany(
                { _id: x.vehicles }, 
                {"vehicle_available": true,},
                { new: true })
            .exec();
        });

        // Query Database Services
        await RouteService.deleteRoute(routeId);

        return res.json({
            success: true,
            message: `Route ${routeId} deleted!`,
            route_delete: routes
        });
        
    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}