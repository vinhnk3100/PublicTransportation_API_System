const User = require("../models/User.model")

exports.register = async (req, res, next) => {
    const { username, phoneNumber } = req.body
    try {
        // Check duplicate from username & phone number
        const userName = await User.find({username: username}).lean().exec();
        const userPhoneNumber = await User.find({ phoneNumber: phoneNumber}).lean().exec();
        if (userName.length > 0 || userPhoneNumber.length > 0) {
            return res.json({
                success: false,
                message: `Check Duplicate: ${userName.length >= 1 ? 'Username is already existed' : 'Phone numbers is already existed'}`
            })
        }
        if (phoneNumber.length > 12) {
            return res.json({
                success: false,
                message: `Check Duplicate: Phone numbers is too long`
            })
        }
    } catch (e) {
        console.log("ERR: Check Duplicate Register: ", e)
        return res.json({
            success: false,
            message: "Check Duplicate Register: " + e
        })
    }
    next()
}

module.exports = this