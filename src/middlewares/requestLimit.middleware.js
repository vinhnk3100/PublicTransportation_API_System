const rateLimit = require('express-rate-limit')

exports.requestLimit = rateLimit({
    windowMs: 10 * 1000, // 10 seconds in milliseconds
    max: 1,
    message:
		'Request too many, try again after 10 seconds',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = this