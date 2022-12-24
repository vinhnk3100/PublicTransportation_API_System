const mongoose = require('mongoose');
const UserService = require('../services/user.service')
const { AuthService } = require("../services/index");
const { verifyToken, verifyRefreshToken } = require('../utils/jsonTokenGenerator.utils');

exports.verifyValidRefreshToken = async (req, res, next) => {
    const { refresh_token } = req.headers;
    try {
        if (refresh_token) {
            const { id, username } = verifyRefreshToken(refresh_token)
            if (id && mongoose.isValidObjectId(id)) {
                const user = await UserService.getAuthLoginUser(username)
                if (user) {
                    return res.json({
                        ...AuthService.getToken(user)
                    })
                }
            }
        }
        return next();
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "Refresh token expired. Please login again!" + e.message
        })
    }
}

exports.verifyValidAccessToken = async (req, res, next) => {
    const { access_token } = req.headers;

    try {
        if (access_token) {
            const { id } = verifyToken(access_token);
            if (id && mongoose.isValidObjectId(id)) {
                const user = await UserService.getUserById(id)
                if (user) {
                    return next()
                }
            }
        }

        return res.status(401).json({
            success: false,
            message: 'UNAUTHORIZED'
        });
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: 'Time Session expired'
        });
    }
}