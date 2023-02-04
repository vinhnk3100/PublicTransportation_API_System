// UserController - Get, Create, Update, Delete
// Some functions specify only for administrator
const ROLE = require("../helpers/roles");
const { UserService, RouteService, TicketService } = require('../services/index')
const { verifyToken } = require('../utils/jsonTokenGenerator.utils');
const { isWalletInsufficient } = require("../utils/checkWalletTransaction.ultis")
const QRCode = require('qrcode')

// ========================= CRUD Sections

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

// Get by UID
exports.getById = async (req, res, next) => {
    try {
        const user = res.locals.user

        return res.json({
            success: true,
            message: "User found!",
            user: user
        })
    } catch (e) {
        console.log("UserController: Get User By Id Error: ", e);
        next(e);
    }
}

// Create - Admin only
exports.create = async (req, res, next) => {
    const { username, fullname, password, phoneNumber, role, wallet } = req.body

    try {
        const newUser = await UserService.createUser(username, fullname, password, phoneNumber, role, wallet);

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
    try {
        const userId = res.locals.userId
        const update = req.body;
    
        if (update.role && req.session.role !== ROLE.ADMIN) {
            return res.json({
                success: true,
                message: "Access denied. You do not have permission to change role!"
            })
        }

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

// ========================= Utilities Sections

// Get wallet
exports.getAmountWallet = async (req, res ,next) => {
    try {
        const { access_token } = req.headers;
        const { id } = verifyToken(access_token)
        const userId = id;

        const userWallet = await UserService.getUserById(userId)

        return res.json({
            success: true,
            user_wallet: userWallet[0].wallet
        })

    } catch (e) {
        console.log("UserController: Get Amount Wallet Error: ", e);
        next(e);
    }
}

// Add money to Wallet
exports.depositAmountWallet = async (req, res, next) => {
    try {
        const { access_token } = req.headers;
        const { id } = verifyToken(access_token)
        const userId = id
        const update = req.body;

        const updateWallet = await UserService.updateUser(userId, { $inc: { wallet: update.wallet }});

        await updateWallet.save();

        return res.json({
            success: true,
            message: `Deposit wallet success!`,
            wallet: updateWallet
        })

    } catch (e) {
        console.log("UserController: Update Wallet Error: ", e);
        next(e);
    }
}