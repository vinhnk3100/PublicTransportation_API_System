const Router = require('express').Router();
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const vehicleRouter = require('./vehicle.routes');
const managementUnitRouter = require("./managementUnit.routes");
const routeRouter = require("./route.routes")
const ticketRoute = require("./ticket.routes")

// api/auth - Login & Registation
Router.use('/auth', authRouter);

// api/user - User
Router.use('/user', userRouter);

// api/vehicle - Vehicle
Router.use('/vehicle', vehicleRouter);

// api/mgtunit - Management Unit
Router.use('/mgtunit', managementUnitRouter);

// api/route - Route
Router.use('/route', routeRouter);

// api/ticket - Ticket
Router.use('/ticket', ticketRoute)

// Handle error
Router.use((err, req, res, next) => {
    return res.status(500).json({
        success: false,
        message: 'ERR: Handling API Error',
    });
});
  
  module.exports = Router;
  