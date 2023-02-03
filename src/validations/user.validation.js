const mongoose = require('mongoose');
const { UserService } = require('../services');

exports.checkValidUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId && mongoose.isValidObjectId(userId)) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        
        const user = await UserService.getUserById(userId);

        if (!user || user.length < 1) {
            return res.json({
                success: false,
                message: "User is not existed!"
            })
        }

        res.locals.userId = userId
        res.locals.user = user
        
        next()
    } catch (e) {
        throw new Error(e.message)   
    }
}