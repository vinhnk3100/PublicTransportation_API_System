const Router = require("express").Router()
const tokenValidation = require("../middlewares/auth.middleware")
const orderController = require('../controllers/order.controller')
const roleValidation = require("../validations/role.validation")

const TicketModel = require("../models/Ticket.model");
const OrderModel = require('../models/Order.model')

// validations
const routeValidation = require("../validations/route.validation");

Router.get('/', 
    tokenValidation.verifyValidAccessToken,
    orderController.get
)

// Create order
Router.post('/create',
    tokenValidation.verifyValidAccessToken,
    routeValidation.filterUrlInvalidRouteId,
    orderController.create
)

// Return URL (Địa chỉ xử lý dữ liệu và trả thông báo kết quả thanh toán)
Router.get('/vnpay-return',
    orderController.returnUrl
)

// Delete Order with Null ticket
Router.delete('/invalid-order',
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    orderController.deleteOrderNull
)

// Delete order
Router.delete('/:orderId',
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    orderController.delete
)

// Delete all order
Router.delete('/',
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    orderController.deleteAll
)


module.exports = Router