const Router = require("express").Router()
const tokenValidation = require("../middlewares/auth.middleware")
const orderController = require('../controllers/order.controller')

// validations
const routeValidation = require("../validations/route.validation");

Router.get('/', 
    tokenValidation.verifyValidRefreshToken,
    tokenValidation.verifyValidAccessToken,
    orderController.get
)

// Create order
Router.post('/create',
    tokenValidation.verifyValidRefreshToken,
    tokenValidation.verifyValidAccessToken,
    routeValidation.filterUrlInvalidRouteId,
    orderController.createOrder
)

// Return URL (Địa chỉ để nhận kết quả sau thanh toán)
Router.get('/vnpay-order-return',
    orderController.returnUrl
)

module.exports = Router