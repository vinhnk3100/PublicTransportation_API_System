const Router = require("express").Router()
const tokenValidation = require("../middlewares/auth.middleware")
const orderController = require('../controllers/order.controller')

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

// Delete order
Router.delete('/:orderId',
    tokenValidation.verifyValidAccessToken,
    orderController.delete
)

Router.delete('/',
    tokenValidation.verifyValidAccessToken,
    async () => {
        return await OrderModel.deleteMany({});
    }
)

module.exports = Router