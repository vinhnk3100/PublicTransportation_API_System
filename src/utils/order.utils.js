const moment = require('moment')
const QRCode = require('qrcode')
const querystring = require('qs')
const { vnpParamsURLSigned } = require('../utils/vnpay.utils')
const { UserService, TicketService, OrderService } = require("../services/index");
const { isWalletInsufficient } = require("../utils/checkWalletTransaction.ultis")

let getUserId = '';
let getRouteId = '';
let getTicketPrice = 0;
let getUserFullname = '';
let getTicketType = '';

// Payment with VNPay Credit Card - NCB ==================================
/**
 * 1. Chọn phương thức thanh toán
 * 2. Gửi URL cho phép người dùng ghi thông tin thẻ
 * 3. Nếu thành công, tạo vé - qr code
 * 4. Tạo order và cập nhật order
 * 5. Trả thông báo về cho ngdung
 */
exports.vnPayOrder = async (
    {   
        fullname,
        routeId,
        currentUserId,
        ipAddr,
        routeAmount,
        bankCode,
        orderDescription,
        orderType,
        locale 
    }
    ) => {
    // Passing data to create Order
    getUserId = currentUserId;
    getRouteId = routeId;
    getTicketPrice = routeAmount;
    getUserFullname = fullname;
    getTicketType = orderType;

    // .1
    orderType = "topup"
    let date = new Date();
    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnp_ReturnUrl;
    let createDate = moment(date).format('yyyyMMDDHHmmss');

    if(locale === null || locale === ''){
        locale = 'vn';
    }

    let orderId = moment(date).format('HHmmss');
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderDescription;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = routeAmount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = await this.sortObject(vnp_Params);

    const signed = await vnpParamsURLSigned(vnp_Params, secretKey)
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    // .2
    return vnpUrl
}

exports.handleSuccessVnPayOrder = async () => {
    // 3.
    const createTicket = await TicketService.createTicket(getUserFullname, getRouteId, getTicketType, getTicketPrice)
    
    const qrCode = await QRCode.toDataURL(`https://publictransport-api.cyclic.app/api/ticket/scan/${createTicket._id}`)
    await TicketService.updateTicket(createTicket._id, {qr_code: qrCode})

    // 4.
    const createOrder = await OrderService.createOrder(getTicketType, getUserId, createTicket._id, getRouteId)
    
    // 5.
    return createOrder
}

exports.sortObject = async (obj) => {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// End Payment with VNPay Credit Card - NCB ==============================

// Payment with Wallet App ===============================================
/** 
 * 1. Kiểm tra ví người dùng => false sẽ trả thẳng ra thanh toán thất bại
 * 2. Sau khi thanh toán cập nhật ví
 * 3. Tạo vé
 * 4. Cập nhật mã QR
 * 5. Cập nhật lịch sử giao dịch
 */
exports.buyTicketWithWalletAppOrder = async (route, user, fullname, routeId, ticketType, userWallet, routeAmount, currentUserId) => {
    // 1.
    const isSufficient = await isWalletInsufficient(route, user[0].wallet);

    if (!isSufficient) {
        return res.json({
            success: true,
            message: 'Transaction Failed!'
        })
    }

    // 2.
    userWallet = user[0].wallet - route.route_price

    // 3.
    const createTicket = await TicketService.createTicket(fullname, routeId, ticketType, routeAmount)
    
    // 4.
    const qrCode = await QRCode.toDataURL(`https://publictransport-api.cyclic.app/api/ticket/scan/${createTicket._id}`)
    await TicketService.updateTicket(createTicket._id, {qr_code: qrCode})

    return createTicket;
}

exports.handleOrderAppWallet = async (orderType, userId, ticketId, ticketPrice) => {
    // .5
    const createOrder = await OrderService.createOrder(orderType, userId, ticketId, ticketPrice)
    return createOrder
}

// End Payment with Wallet App ===========================================