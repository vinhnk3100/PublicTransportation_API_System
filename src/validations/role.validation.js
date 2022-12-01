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
    if (req.session.role !== Role.STAFF || req.session.role !== Role.ADMIN) {
        return res.json({
            success: true,
            message: "Access denied!"
        });
    }
    next();
}

module.exports = this