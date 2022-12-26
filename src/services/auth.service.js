const { tokenExpired, generateToken, generateRefreshToken } = require('../utils/jsonTokenGenerator.utils');

const getToken = (user) => {
    const userPayloadToken = {
        id: user['_id'].toHexString(),
        username: user['username'],
        fullname: user['fullname'],
        phoneNumber: user['phoneNumber'],
        role: user['role'],
        wallet: user['wallet'],
        historyPurchase: user['history_purchase']
    }
    let accessToken = generateToken(userPayloadToken);
    let refreshToken = generateRefreshToken(userPayloadToken);
    let tokenExpire = tokenExpired()

    return {
        accessToken, refreshToken, tokenExpire
    }
}

module.exports = {
    getToken
}