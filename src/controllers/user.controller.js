// UserController - Get, Create, Update, Delete
// Some functions specify only for administrator
const ROLE = require("../helpers/roles");
const { UserService } = require('../services/index')
const { verifyToken } = require('../utils/jsonTokenGenerator.utils');

const { vnpParamsURLSigned } = require('../utils/vnpay.utils')

const {
    vnPayOrder,
    sortObject,
} = require('../utils/order.utils');

const {
    depositWallet,
} = require('../utils/user.utils');


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
exports.getAmountWallet = async (req, res, next) => {
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
exports.returnURL = async (req, res, next) => {

    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = await sortObject(vnp_Params);

    let secretKey = process.env.vnp_HashSecret;

    const signed = await vnpParamsURLSigned(vnp_Params, secretKey)

    if (secureHash === signed) {
        if (vnp_Params['vnp_ResponseCode'] === "00") {

            // ===== Xử lý hậu thanh toán
            const { access_token } = req.headers;
            const { id } = verifyToken(access_token)

            const userId = id;
            const amount  = isNaN(vnp_Params['vnp_Amount']) ? 0 : vnp_Params['vnp_Amount'] / 100;

            const updateUserWallet = await depositWallet({ userId, amount });

            // ===== Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            return res.json({
                success: !!updateUserWallet?.success,
                message: !!updateUserWallet?.success ? 'Giao dịch thành công' : updateUserWallet?.message,
                code: vnp_Params['vnp_ResponseCode']
            })
        }

        else {
            return res.json({
                success: false,
                message: 'Giao dịch thất bại',
                code: '97'
            })
        }
    } else {
        return res.json({
            success: false,
            message: 'Chữ ký không hợp lệ',
        })
    }
}

exports.createWalletDepositOrder = async (req, res, next) => {
    let { bankCode, orderDescription, orderId, amount, locale } = req.body
    const { access_token } = req.headers;
    const { id: currentUserId, fullname } = verifyToken(access_token)

    try {
        const user = await UserService.getUserById(currentUserId);

        // Check if user existed
        if (!user || user.length < 1) {
            return res.json({
                success: false,
                message: "User is not existed!"
            })
        }

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const vnPayOrderData = {
            ipAddr,
            amount,
            bankCode,
            orderDescription,
            locale
        }

        const vnpayURL = await vnPayOrder({ ...vnPayOrderData, orderId: orderId });

        if (vnpayURL) {
            return res.json({
                success: true,
                url: vnpayURL
            })
        } else {
            return res.json({
                success: false,
                message: "Lỗi hệ thống",
            })
        }
    } catch (e) {
        console.log("error", e.message);
        throw new Error(e.message)
    }
}