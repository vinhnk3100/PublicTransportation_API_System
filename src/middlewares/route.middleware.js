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
    const expiredTime = 21
    const routes = await RouteService.getRoute()

    // If 9:00 PM - remove route
    removeRouteOnTime(routes, expiredTime)
    next()
}

function removeRouteOnTime (routes, expiredTime) {
    routes?.map(route => {
        let job = new cronJob(`* * ${expiredTime} * * *`,
            async function() {
                const routeDelete = await RouteService.deleteManyRoute()
                await TicketService.updateManyTicket({ is_valid: false });
                await VehicleService.updateManyVehicle({ vehicle_available: true })

                return res.json({
                    success: true,
                    message: "All route reset!",
                    route_deleted: routeDelete
                })
            },
            null,
            true,
            'Asia/Ho_Chi_Minh'
        )

        job.start()
    })
}
