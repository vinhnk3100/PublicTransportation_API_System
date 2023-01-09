const mongoose = require('mongoose');
const { route } = require('../routes/auth.routes');
const cronJob = require('cron').CronJob;
const { RouteService, TicketService, VehicleService } = require("../services/index");

/**
 * If Route deleted
 *  ticket is_valid = false
 *  vehicle_available = true
 */

exports.removeTimeOutRouteAndTicket = async (req, res, next) => {
    const expiredRouteHour = 20
    // If 8:00 PM - Delete all Route
    const routes = await RouteService.getRoute()
    next()
    // routes?.map(route => {
    //     console.log(route.time_end.hours)
    //     let job = new cronJob(`${route.time_end.hours} * * * * *`,
    //         async function() {
    //             console.log(route.time_end.hours)
    //             // const routeDelete = await RouteService.deleteManyRoute()
    //             // await TicketService.updateManyTicket({ is_valid: false });
    //             // await VehicleService.updateManyVehicle({ vehicle_available: true })

    //             // return res.json({
    //             //     success: true,
    //             //     message: "All route reset!",
    //             //     route_deleted: routeDelete
    //             // })
    //         },
    //         next(),
    //         true,
    //         'Asia/Ho_Chi_Minh'
    //     )

    //     job.start()
    // })
}
