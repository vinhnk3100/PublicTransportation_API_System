// UserController - Get, Create, Update, Delete
// Some functions specify only for administrator
const ROLE = require("../helpers/roles");
const { UserService } = require('../services/index')

// Get
exports.get = async (req, res, next) => {
    try {
        const user = await UserService.getUser();

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
        const newUser = await UserService.createUser(username, fullname, password, phoneNumber, role)

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
    
    if (update.role && req.session.role !== ROLE.ADMIN) {
        return res.json({
            success: true,
            message: "Access denied. You do not have permission to change role!"
        })
    }
    
    try {
        let updateUser = await UserService.updateUser(userId, update)

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
        const user = await UserService.deleteUser(userId)

        if (!user || user.length < 1) {
            return res.json({
                success: false,
                message: "User not existed!"
            })
        }

        return res.json({
            success: true,
            message: `User ${userId} deleted!`,
            user_delete: user
        })
    } catch (e) {
        console.log("UserController: Delete User Error: ", e);
        next(e);
    }
}