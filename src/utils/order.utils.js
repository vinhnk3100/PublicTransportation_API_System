const moment = require('moment')
const QRCode = require('qrcode')
const querystring = require('qs')
const { vnpParamsURLSigned } = require('../utils/vnpay.utils')
const { UserService, TicketService } = require("../services/index");
const { isWalletInsufficient } = require("../utils/checkWalletTransaction.ultis")


// Payment with VNPay Credit Card - NCB ==================================
exports.vnPayOrder = async (ipAddr, routeAmount, bankCode, orderDescription, orderType, locale) => {
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

    return vnpUrl
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
exports.walletAppOrder = async (route, user, fullname, routeId, ticketType, userWallet, routeAmount, currentUserId) => {
    // Check user wallet is available for buying ticket / Return true => continue to buy ticket
    const isSufficient = await isWalletInsufficient(route, user[0].wallet);

    if (!isSufficient) {
        return res.json({
            success: true,
            message: 'Transaction Failed!'
        })
    }

    // If user have enough money in wallet - Update there money wallet ======== then return true
    userWallet = user[0].wallet - route.route_price

    // Buy Ticket => Create new ticket for the user (Require: user fullname & the route ID)
    const createTicket = await TicketService.createTicket(fullname, routeId, ticketType, routeAmount)
    
    // Update qr code in ticket
    const qrCode = await QRCode.toDataURL(`https://publictransport-api.cyclic.app/api/ticket/scan/${createTicket._id}`)
    await TicketService.updateTicket(createTicket._id, {qr_code: qrCode})

    // Update history purchase in user
    await UserService.updateUser(currentUserId, {
        wallet: userWallet,
        $push: { history_purchase: {
            message: `Purchase ticket successfully!`,
            data_purchase: {
                ticket_id: createTicket._id.toHexString()
            }
        }}
    })

    return createTicket;
}

// End Payment with Wallet App ===========================================