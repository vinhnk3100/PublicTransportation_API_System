const { default: mongoose } = require('mongoose');
const { tokenExpired, generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jsonTokenGenerator.utils');

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

const requestAccessToken = (refreshToken) => {
    try {
        const { id } = verifyRefreshToken(refreshToken);
        if (id && mongoose.isValidObjectId(id)) {
            console.log(id)
        }
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    getToken,
    requestAccessToken
}