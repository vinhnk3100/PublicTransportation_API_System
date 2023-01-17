const moment = require('moment');
const querystring = require('qs');

const { OrderService } = require("../services/index")
const { vnpParamsURLSigned } = require('../utils/vnpay.utils');

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
 * 2. Type order 2 - Using app wallet
 */
exports.createOrder = async (req, res, next) => {
    let { amount, bankCode, orderDescription, orderType, locale } = req.body

    try {
        if (orderType === 1) {
            orderType = "topup"
            let date = new Date();
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

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
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if(bankCode !== null && bankCode !== ''){
                vnp_Params['vnp_BankCode'] = bankCode;
            }
        
            vnp_Params = sortObject(vnp_Params);

            const signed = await vnpParamsURLSigned(vnp_Params, secretKey)
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        
            return res.redirect(vnpUrl)
        }

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

    vnp_Params = sortObject(vnp_Params);

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

function sortObject(obj) {
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