const querystring = require('qs');
const crypto = require("crypto");

exports.vnpParamsURLSigned = (vnp_Params, secretKey) => {
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    return signed
}