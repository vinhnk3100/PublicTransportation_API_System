// AuthController - Register & Login actions

const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { AuthService, UserService } = require("../services/index")
const { verifyRefreshToken } = require('../utils/jsonTokenGenerator.utils');

const session = require('express-session');

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await UserService.getAuthLoginUser(username);

        if (user) {
            req.session.role = user.role;
            req.session.userId = user._id;
            
            const hashedPassword = user.password;
            if (bcrypt.compareSync(password, hashedPassword)) {
                return res
                    .json({
                        success: true,
                        message: "AuthController: Login successfully!",
                        ...AuthService.getToken(user),
                        user: user
                    })
            }
            return res.status(401).json({
                success: false,
                message: 'AuthController: Username or Password incorrect!',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'AuthController: User not exist!',
        });
    } catch(e) {
        console.log("ERR: Auth Controller: ", e)
        next(e);
    }
}

// Role: Customer default when register
exports.register = async (req, res, next) => {
    const { username, fullname, password, phoneNumber } = req.body
    try {
        const newUser = await UserService.createUser(username, fullname, password, phoneNumber);

        return res.json({
            success: true,
            message: "AuthController: Create User Success!",
            user: newUser
        })
    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}

exports.refreshToken = async (req, res, next) => {
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
            message: `${'invalid signature' ? 'Invalid Token' : 'Refresh token expired. Please login again'}`
        })
    }
}