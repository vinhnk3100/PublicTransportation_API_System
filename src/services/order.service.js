const OrderModel = require('../models/Order.model')

const getOrder = async () => {
    try {
        return await OrderModel.find({}).populate("user", "fullname").populate("ticket").populate("route").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getOrderById = async (id) => {
    try {
        return await OrderModel.findById(id).populate("user", "fullname").populate("ticket").populate("route").lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createOrder = async (orderType, userId, ticketId, routeId) => {
    try {
        return await OrderModel.create({
            order_type: orderType,
            order_status: "01",
            user: userId,
            ticket: ticketId,
            route: routeId,
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const updateOrder = async (orderId, update) => {
    try {
        return await OrderModel.findByIdAndUpdate({ _id: orderId }, update, {
            new: true
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

const deleteOrderNullTicket = async (listOrderId) => {
    try {
        return await OrderModel.deleteMany({ _id: listOrderId }).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const deleteAllOrder = async () => {
    try {
        return await OrderModel.deleteMany().lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getOrder,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteOrderNullTicket,
    deleteAllOrder
}