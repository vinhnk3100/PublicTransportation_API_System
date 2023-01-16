const Router = require("express").Router();
const vnPayControllerTest = require('../controllers/vnpaytest.controller')

// Render order list
Router.get('/', vnPayControllerTest.getOrderList);

// Create order
Router.post('/create-vnpay-order', vnPayControllerTest.createOrder)

// Return order
Router.get('/vnpay-order-return', vnPayControllerTest.returnOrder)

// Return Ipn
Router.get('/vnpay_ipn', vnPayControllerTest.returnIpn)

module.exports = Router;