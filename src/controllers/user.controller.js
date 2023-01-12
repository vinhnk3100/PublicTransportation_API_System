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
    const { userId } = req.params;
    try {
        const user = await UserService.getUserById(userId);

        if (!user || user.length < 1) {
            return res.json({
                success: false,
                message: "User is not existed!"
            })
        }

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

// ========================= Utilities Sections

// Buy Ticket
exports.buyTicket = async (req, res, next) => {
    const { access_token } = req.headers;
    const { id, fullname } = verifyToken(access_token)
    const currentUserId = id;
    const routeId = req.routeInvalidFiltered;
    const ticketType = req.ticketType
    let userWallet = 0;

    try {
        const user = await UserService.getUserById(currentUserId);
        const route = await RouteService.getRouteById(routeId)
        
        // Check if user existed
        if (!user || user.length < 1) {
            return res.json({
                success: false,
                message: "User is not existed!"
            })
        }

        // Check user wallet is available for buying ticket / Return true => continue to buy ticket
        const isSufficient = await isWalletInsufficient(route, user[0].wallet);

        if (!isSufficient) {
            return res.json({
                success: true,
                message: 'Transaction Failed!'
            })
        }

        // If user have enough money in wallet - Update there money wallet ======== then return true
        userWallet = user[0].wallet - route.route_price

        // Buy Ticket => Create new ticket for the user (Require: user fullname & the route ID)
        const createTicket = await TicketService.createTicket(fullname, routeId, ticketType)

        // Update qr code in ticket
        const qrCode = await QRCode.toDataURL(`https://publictransport-api.cyclic.app/api/ticket/${createTicket._id}`)
        await TicketService.updateTicket(createTicket._id, {qr_code: qrCode})

        // Update history purchase in user
        await UserService.updateUser(id, {
            wallet: userWallet,
            $push: { history_purchase: {
                message: `Purchase ticket successfully!`,
                data_purchase: {
                    ticket_id: createTicket._id.toHexString()
                }
            }}
        })

        return res.json({
            success: true,
            message: 'Ticket bought successfully!',
            ticket_data: createTicket,
            qr_code: qrCode
        })

    } catch (e) {
        console.log("UserController: Buy Ticket Error: ", e);
        next(e); 
    }
}