const Router = require("express").Router()
const orderController = require('../controllers/order.controller')

Router.get('/', orderController.get)

// Create order
Router.post('/create-order', orderController.createOrder)

// Return URL (Địa chỉ để nhận kết quả sau thanh toán)
Router.get('/vnpay-order-return', orderController.returnUrl)

module.exports = Router