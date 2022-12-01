// UserController - Get, Create, Update, Delete
// Some functions specify only for administrator

const User = require('../models/User.model')

exports.get = async (req, res, next) => {
    const user = await User.find({}).lean().exec();

    if (!user) {
        return res.json({
            success: true,
            message: "No user existed right now!"
        })
    }

    return res.json({
        success: true,
        message: "Users found!",
        users: user
    })
}