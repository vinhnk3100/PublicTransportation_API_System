// AuthController - Register & Login actions

const User = require('../models/User.model')
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jsonTokenGenerator');
const session = require('express-session');

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({username: username}).lean().exec();
        if (user) {
            const hashedPassword = user.password;
            if (bcrypt.compareSync(password, hashedPassword)) {
                req.session.role = user.role;
                return res
                    .cookie('access_token', generateToken({ id: user['_id'].toString()}), {httpOnly: true})
                    .json({
                        success: true,
                        message: "AuthController: Login successfully!",
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
        const newUser = await User.create({
            username: username,
            fullname: fullname,
            password: bcrypt.hashSync(password, 10),
            phoneNumber: phoneNumber,
        })

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