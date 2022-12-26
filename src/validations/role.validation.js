const Role = require("../helpers/roles")
const { verifyToken } = require('../utils/jsonTokenGenerator.utils');

exports.admin = async (req, res, next) => {
    const { access_token } = req.headers;
    const { role } = verifyToken(access_token)

    if (role !== Role.ADMIN) {
        return res.json({
            success: true,
            message: "Access denied admin!"
        });
    }
    next();
}

module.exports = this