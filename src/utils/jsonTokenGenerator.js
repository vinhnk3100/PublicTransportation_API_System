const jwt = require('jsonwebtoken')

const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
const tokenExpire = process.env.TOKEN_EXPIRE;

// Generate Token
exports.generateToken = (payload) => jwt.sign(payload, tokenSecretKey, {expiresIn: tokenExpire});

// Verify Token User
exports.verifyToken = (token) => jwt.verify(token, tokenSecretKey);