const { UserService } = require('../services/index')

exports.depositWallet = async ({ userId, amount }) => {
    let result;
    try {
        const updateWallet = await UserService.updateUser(userId, { $inc: { wallet: amount } });

        await updateWallet.save();

        return {
            success: true,
            message: `Deposit wallet success!`,
        }

    } catch (e) {
        console.log("UserController: Update Wallet Error: ", e);
        return {
            success: false,
            message: `System Error!`,
        }
    }
}