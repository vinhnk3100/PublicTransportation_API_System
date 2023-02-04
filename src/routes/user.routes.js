const Router = require("express").Router();
const roleValidation = require("../validations/role.validation");
const userController = require("../controllers/user.controller");
const authValidation = require("../validations/auth.validation");
const userValidation = require("../validations/user.validation");

const tokenValidation = require("../middlewares/auth.middleware")

// Get all user
Router.get('/', userController.get);

// Get user by uid
Router.get('/:userId',
    userValidation.checkValidUserId,
    userController.getById
)

// Create User (Admin)
Router.post('/create',
    roleValidation.admin,
    authValidation.registerValidation,
    userController.create
);

// Update User
Router.put('/:userId',
    userValidation.checkValidUserId,
    userController.update
);

// Delete User
Router.delete('/:userId',
    roleValidation.admin,
    userController.delete
);

// ========================================== Utilities Sections ==========================================

// Get amount wallet
Router.get('/wallet/get',
    userController.getAmountWallet
)

Router.post('/wallet/deposit/create',
    tokenValidation.verifyValidAccessToken,
    userController.createWalletDepositOrder
);

// Add wallet money
Router.get('/wallet/deposit/vnpay-return',
    userController.returnURL
);



module.exports = Router;