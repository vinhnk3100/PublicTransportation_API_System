const User = require("../models/User.model")
const Role = require("../helpers/roles")

exports.admin = async (req, res, next) => {
    if (req.session.role !== Role.ADMIN) {
        return res.json({
            success: true,
            message: "Access denied!"
        });
    }
    next();
}

exports.staff = async (req, res, next) => {
    console.log(req.session.role)
    if (req.session.role === Role.STAFF || req.session.role === Role.ADMIN) {
        next();
        return;
    }
    return res.json({
        success: true,
        message: "Access denied!"
    });
}

module.exports = this