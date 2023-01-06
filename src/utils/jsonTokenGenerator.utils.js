const jwt = require('jsonwebtoken')

const tokenRefreshSecretKey = process.env.TOKEN_SECRET_REFRESH_KEY;
const tokenRefreshExpire = process.env.TOKEN_REFRESH_EXPIRE;
const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
const tokenExpire = process.env.TOKEN_EXPIRE;

// Export token expired date
exports.tokenExpired = () => { return Date.now() + 1 * 60 * 60 * 1000 }

// Generate Token
exports.generateToken = (payload) => jwt.sign(payload, tokenSecretKey, { algorithm: 'HS256', expiresIn: tokenExpire });

// Refresh Token - Generate random refresh token
exports.generateRefreshToken = (payload) => jwt.sign(payload, tokenRefreshSecretKey, { algorithm: 'HS256', expiresIn: tokenRefreshExpire})

// Verify Token User
exports.verifyToken = (token) => jwt.verify(token, tokenSecretKey);

// Verify Refresh Token
exports.verifyRefreshToken = (refreshToken) => jwt.verify(refreshToken, tokenRefreshSecretKey);