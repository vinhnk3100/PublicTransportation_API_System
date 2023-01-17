const OrderModel = require('../models/Order.model')

const getOrder = async () => {
    try {
        return await OrderModel.find({}).populate("user").populate("ticket").populate("ticket", "ticket_price").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getOrder
}