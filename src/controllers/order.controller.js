
const TICKET_TYPE = require('../helpers/ticketTypes')
const { vnpParamsURLSigned } = require('../utils/vnpay.utils')
const { verifyToken } = require('../utils/jsonTokenGenerator.utils');
const { OrderService, UserService, RouteService } = require("../services/index");
const { vnPayOrder, sortObject, walletAppOrder } = require('../utils/order.utils');

exports.get = async (req, res, next) => {
    try {
        const orders = await OrderService.getOrder();

        if (!orders || orders.length < 1) {
            return res.json({
                success: true,
                message: "No order found!"
            })
        }

        return res.json({
            success: true,
            message: 'Get all orders',
            total_payment: orders.length,
            orders: orders
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

/**
 * 1. Type order 1 - Using credit VNPay
 * Transaction Success
 * Return Url success from VNPay
 * Create Ticket
 * Updating QR code in ticket after generating
 * Update history purchase
 * Return true
 * 
 * 2. Type order 2 - Using app wallet
 * Check insufficient wallet => If sufficient
 * Create Ticket
 * Updating QR code in ticket after generating
 * Update history purchase
 * Return true
 */
exports.createOrder = async (req, res, next) => {
    let { bankCode, orderDescription, orderType, locale } = req.body
    const { access_token } = req.headers;
    const { id, fullname } = verifyToken(access_token)
    const currentUserId = id;
    const routeId = req.routeInvalidFiltered;
    const ticketType = req.ticketType
    let userWallet, routeAmount = 0;

    try {
        const user = await UserService.getUserById(currentUserId);
        const route = await RouteService.getRouteById(routeId);
        
        if (parseInt(ticketType) === TICKET_TYPE.ONETIME_USE) {
            routeAmount = route.route_price
        } else if (parseInt(ticketType) === TICKET_TYPE.MONTH_USE) {
            routeAmount = 50000
        }

        // Check if user existed
        if (!user || user.length < 1) {
            return res.json({
                success: false,
                message: "User is not existed!"
            })
        }

        // Transactions with VNPay
        if (orderType === 1) {
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const getVNPUrl = await vnPayOrder(ipAddr, routeAmount, bankCode, orderDescription, orderType, locale)

            return res.json({
                success: true,
                url: getVNPUrl
            })
        }

        // Transaction with Wallet App
        const createTicket = await walletAppOrder(route, user, fullname, routeId, ticketType, userWallet, routeAmount, currentUserId)
        
        return res.json({
            success: true,
            message: 'Ticket bought successfully!',
            ticket_data: createTicket
        })

    } catch (e) {
        throw new Error(e.message)
    }
}

// địa chỉ để nhận kết quả thanh toán từ VNPAY
exports.returnUrl = async (req, res, next) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = await sortObject(vnp_Params);


    let secretKey = process.env.vnp_HashSecret;

    const signed = await vnpParamsURLSigned(vnp_Params, secretKey)

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        return res.json({
            success: true,
            message: "Buy ticket success",
            code: vnp_Params['vnp_ResponseCode']
        })
    } else{
        return res.json({
            success: false,
            message: "Transaction failed",
            code: '97'
        })
    }
}
