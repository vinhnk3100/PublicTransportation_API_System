const Router = require('express').Router();
const authRouter = require('./auth.routes');
const { verifyValidAccessToken, verifyValidRefreshToken } = require('../middlewares/auth.middleware');
const userRouter = require('./user.routes');
const vehicleRouter = require('./vehicle.routes');
const managementUnitRouter = require("./managementUnit.routes");
const routeRouter = require("./route.routes")
const ticketRoute = require("./ticket.routes")

// api/auth - Login & Registation
Router.use('/auth', authRouter);

// api/route - Route
Router.use('/route', routeRouter);

// api/vehicle - Vehicle
Router.use('/vehicle', vehicleRouter);

// ======================================= Route that need access & refresh token =================================================

// Check expired refresh Token => new Access token
Router.use(verifyValidRefreshToken)

// Verify User Access Token
Router.use(verifyValidAccessToken);

// api/user - User
Router.use('/user', userRouter);

// api/mgtunit - Management Unit
Router.use('/mgtunit', managementUnitRouter);

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
  