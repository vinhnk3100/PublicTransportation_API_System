const RouteModel = require('../models/Route.model')

const getRoute = async () => {
    try {
        return await RouteModel.find({}).populate("vehicles").populate("route_agencies", "mgtunit_name").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getRouteById = async (routeId) => {
    try {
        return await RouteModel.findById({ _id: routeId }).populate("vehicles").populate("route_agencies", "mgtunit_name").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getRouteSpecificTime = async (hours, minutes) => {
    try {
        console.log("Hours in service: ", hours)
        return await RouteModel.find({  time_end: { hours: hours, minutes: minutes } }).populate("route_agencies", "mgtunit_name").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createRoute = async (route_number, route_name, route_distance, time_start, time_end, route_spacing, total_route, route_agencies, stations, vehicles) => {
    try {
        return await RouteModel.create({
            route_number: route_number,
            route_name: route_name,
            route_distance: route_distance,
            route_price: route_distance < 15 ? 15000 : route_distance < 25 ? 16000 : 17000,
            time_start: time_start,
            time_end: time_end,
            route_spacing: route_spacing,
            total_route: total_route,
            route_agencies: route_agencies,
            stations: stations,
            vehicles: vehicles
        })
    } catch (e) {
        throw new Error(e.message);
    }
}

const deleteRoute = async (routeId) => {
    try {
        return await RouteModel.findByIdAndDelete({ _id: routeId }).lean().exec();
    } catch (e) {
        throw new Error(e.message);
    }
}


// Test
const deleteManyRoute = async () => {
    try {
        return await RouteModel.deleteMany().lean().exec();
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports = {
    getRoute,
    getRouteById,
    getRouteSpecificTime,
    createRoute,
    deleteRoute,
    deleteManyRoute
}