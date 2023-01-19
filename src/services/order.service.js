const OrderModel = require('../models/Order.model')

const getOrder = async () => {
    try {
        return await OrderModel.find({}).populate("user", "fullname").populate("ticket").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createOrder = async (orderType, userId, ticketId, ticketPrice) => {
    try {
        return await OrderModel.create({
            order_type: orderType,
            user: userId,
            ticket: ticketId,
            ticket_price: ticketPrice
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const deleteOrder = async (orderId) => {
    try {
        return await OrderModel.findByIdAndDelete({ _id: orderId }).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getOrder,
    createOrder,
    deleteOrder
}