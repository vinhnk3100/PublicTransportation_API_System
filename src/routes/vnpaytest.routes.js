const Router = require("express").Router();
const vnPayControllerTest = require('../controllers/vnpaytest.controller')

// Render order list
Router.get('/', vnPayControllerTest.getOrderList);

// Create order
Router.post('/create-vnpay-order', vnPayControllerTest.createOrder)

// Return Ipn (Return Order)
Router.get('/vnpay-ipn', vnPayControllerTest.returnIpn)

// Return URL (For checking data and display notification to user)
Router.get('/vnpay-return', vnPayControllerTest.returnUrl)

module.exports = Router;