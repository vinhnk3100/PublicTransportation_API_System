const moment = require('moment');
const querystring = require('qs');
const { vnpParamsURLSigned } = require('../utils/vnpay.utils');

exports.getOrderList = async (req, res, next) => {
    try {
        const date = new Date();

        const desc = 'Thanh toan don hang thoi gian: ' + date.getDate() + '/' + date.getMonth()+1 + '/' + date.getFullYear();
        
        return res.json({
            success: true,
            message: 'Tạo mới đơn hàng', 
            amount: 10000,
            description: desc
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.createOrder = async (req, res, next) => {
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

    let { amount, bankCode, orderDescription, orderType, locale } = req.body

    try {
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
    } catch (e) {
        throw new Error(e.message)
    }
}

exports.returnIpn = async (req, res, next) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.vnp_HashSecret;

    const signed = await vnpParamsURLSigned(vnp_Params, secretKey)
     
    if(secureHash === signed){
        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        return res.json({
            success: true,
            RspCode: '00',
            order_id: orderId,
            Message: 'success'
        })
    }
    else {
        return res.json({
            success: false,
            RspCode: '97',
            Message: 'Fail checksum'})
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