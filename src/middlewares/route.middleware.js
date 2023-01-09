const mongoose = require('mongoose');
const { route } = require('../routes/auth.routes');
const cronJob = require('cron').CronJob;
const { RouteService, TicketService } = require("../services/index");

exports.removeTimeOutRouteAndTicket = async (req, res, next) => {
    const expiredRouteHour = 20
    // If 8:00 PM - Delete all Route
    let job = new cronJob(`* * ${expiredRouteHour} * * *`,
        async function() {
            const routeDelete = await RouteService.deleteManyRoute()
            return res.json({
                success: true,
                message: "All route reset!",
                route_deleted: routeDelete
            })
        },
        next(),
        true,
        'Asia/Ho_Chi_Minh'
    )

    job.start()
}
