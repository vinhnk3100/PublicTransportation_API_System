const RouteModel = require('../models/Route.model')

const getRoute = async () => {
    try {
        return await RouteModel.find({}).populate("vehicles").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getRouteById = async (routeId) => {
    try {
        return await RouteModel.findById({ _id: routeId }).populate("vehicles").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createRoute = async (route_name, distance_length, time_start, time_end, stations, vehicles) => {
    try {
        return await RouteModel.create({
            route_name: route_name,
            distance_length: distance_length,
            route_price: distance_length < 15 ? 5000 : distance_length < 25 ? 6000 : 7000,
            time_start: time_start,
            time_end: time_end,
            stations: stations,
            vehicles: vehicles
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const deleteRoute = async (routeId) => {
    try {
        return await RouteModel.findByIdAndDelete({ _id: routeId }).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getRoute, getRouteById, createRoute, deleteRoute
}