const Router = require('express').Router();
const authRouter = require('./auth.routes');
const { verifyValidAccessToken } = require('../middlewares/auth.middleware');
const userRouter = require('./user.routes');
const vehicleRouter = require('./vehicle.routes');
const managementUnitRouter = require("./managementUnit.routes");
const routeRouter = require("./route.routes")
const ticketRoute = require("./ticket.routes")
const vnPayTest = require('./vnpaytest.routes')
const orderRouter = require('./order.routes')

// api/vnpay - Order testing ===============================================================================================================
Router.use('/vnpay', vnPayTest)

// ======================================= Route that need access & refresh token =================================================

// api/auth - Login & Registation
Router.use('/auth', authRouter)

// api/route - Route (Token validation checked)
Router.use('/route', routeRouter)

// api/vehicle - Vehicle (Token validation checked)
Router.use('/vehicle', vehicleRouter)

// api/ticket - Ticket (Token validation checked)
Router.use('/ticket', ticketRoute)

// api/order - Order
Router.use('/order', orderRouter)

// Verify User Access Token
Router.use(verifyValidAccessToken)

// api/user - User
Router.use('/user', userRouter)

// api/mgtunit - Management Unit
Router.use('/mgtunit', managementUnitRouter)

// Handle error
Router.use((err, req, res, next) => {
    return res.status(500).json({
        success: false,
        message: 'ERR: Handling API Error',
    });
});
  
  module.exports = Router;
  