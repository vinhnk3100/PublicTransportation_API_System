// UserController - Get, Create, Update, Delete
// Some functions specify only for administrator

const UserModel = require('../models/User.model')

// Get
exports.get = async (req, res, next) => {
    const user = await UserModel.find({}).lean().exec();

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

// Create Staff - Admin only
exports.create = async (req, res, next) => {
    const { username, fullname, password, phoneNumber, role } = req.body
    try {
        const newUser = await UserModel.create({
            username: username,
            fullname: fullname,
            password: bcrypt.hashSync(password, 10),
            phoneNumber: phoneNumber,
            role: role
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

exports.delete = async (req, res, next) => {
    const { userId } = req.params;

    const user = await UserModel.findByIdAndDelete({ _id: userId })

    if (!user) {
        return res.json({
            success: false,
            message: "User not existed!"
        })
    }

    return res.json({
        success: true,
        message: `User ${userId} deleted!`
    })
}