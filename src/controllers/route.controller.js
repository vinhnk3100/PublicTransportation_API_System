// Route Controller: Get - Create - Update - Delete
const { RouteService, TicketService, VehicleService } = require('../services/index');
const filterTicketIdSameRouteId = require('../utils/filterTicketIdSameRouteId.utils');

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
    const { route_number, route_name, route_distance, time_start, time_end, route_spacing, total_route, route_agencies, stations, vehicles } = req.body;

    try {
        // Query Database Services
        const newRoute = await RouteService.createRoute(
            route_number,
            route_name,
            route_distance,
            time_start,
            time_end,
            route_spacing,
            total_route,
            route_agencies,
            stations,
            vehicles
        );

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

/**
 * ========================= DELETE ROUTE =========================
 * 1. Queries routeId in Params and get route data
 * 2. Filtering the ticket with the same route
 * 3. Update vehicle available when route ready to be deleted
 * 4. Deleted Route
 */
exports.delete = async (req, res, next) => {
    const { routeId } = req.params;

    try {
        // 1.
        const routes = await RouteService.getRouteById(routeId);
        const tickets = await TicketService.getTicket();

        if (!routes || routes.length < 1) {
            return res.json({
                success: true,
                message: "Route not existed!"
            });
        };
        
        // 2.
        const listTicketId = await filterTicketIdSameRouteId(routes, tickets)
        await TicketService.updateTicketIdWithDeletedRoute(listTicketId)

        // 3.
        await VehicleService.updateFilterVehicle(
            routes.vehicles.map(route => {return route._id.toHexString()}),
            {"vehicle_available": true,}
        );

        // 4.
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