// UserController - Get, Create, Update, Delete
// Some functions specify only for administrator

const UserModel = require('../models/User.model')
const bcrypt = require('bcrypt');

// Get
exports.get = async (req, res, next) => {
    try {
        const user = await UserModel.find({}).lean().exec();

        if (!user || user.length < 1) {
            return res.json({
                success: true,
                message: "No user existed right now!"
            })
        }

        return res.json({
            success: true,
            message: "Users found!",
            total_user: user.length,
            users: user
        })
    } catch (e) {
        console.log("UserController: Get User Error: ", e);
        next(e);
    }
}

// Create - Admin only
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
        console.log("UserController: Create User Error: ", e);
        next(e);
    }
}

// Update by Id
exports.update = async (req, res, next) => {
    const { userId } = req.params;
    const update = req.body;
    
    try {
        let updateUser = await UserModel.findByIdAndUpdate({ _id: userId }, update, {
            new: true
        })

        if (!updateUser || updateUser.length < 1) {
            return res.json({
                success: true,
                message: "No user existed right now!"
            })
        }

        if (update.password) {
            return res.json({
                success: true,
                message: `Can not change password!`,
            })
        }

        await updateUser.save()

        return res.json({
            success: true,
            message: `User ${userId} updated!`,
            user: updateUser
        })

    } catch (e) {
        console.log("UserController: Update User Error: ", e);
        next(e);
    }
}

// Delete
exports.delete = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findByIdAndDelete({ _id: userId })

        if (!user || user.length < 1) {
            return res.json({
                success: false,
                message: "User not existed!"
            })
        }

        return res.json({
            success: true,
            message: `User ${userId} deleted!`
        })
    } catch (e) {
        console.log("UserController: Delete User Error: ", e);
        next(e);
    }
}