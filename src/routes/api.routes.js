const Router = require('express').Router();
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes')

// api/auth - Login & Registation
Router.use('/auth', authRouter)

// api/user - User
Router.use('/user', userRouter)

// Handle error
Router.use((err, req, res) => {
    return res.status(500).json({
        success: false,
        message: 'ERR: Handling API Error',
    });
});
  
  module.exports = Router;
  