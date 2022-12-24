// AuthController - Register & Login actions

const bcrypt = require('bcrypt');
const { AuthService, UserService } = require("../services/index")
const session = require('express-session');

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await UserService.getAuthLoginUser(username);

        if (user) {
            req.session.role = user.role;
            req.session.userId = user._id;
            
            const hashedPassword = user.password;
            if (bcrypt.compareSync(password, hashedPassword)) {
                return res
                    .json({
                        success: true,
                        message: "AuthController: Login successfully!",
                        ...AuthService.getToken(user),
                        user: user
                    })
            }
            return res.status(401).json({
                success: false,
                message: 'AuthController: Username or Password incorrect!',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'AuthController: User not exist!',
        });
    } catch(e) {
        console.log("ERR: Auth Controller: ", e)
        next(e);
    }
}

// Role: Customer default when register
exports.register = async (req, res, next) => {
    const { username, fullname, password, phoneNumber } = req.body
    try {
        const newUser = await UserService.createUser(username, fullname, password, phoneNumber);

        return res.json({
            success: true,
            message: "AuthController: Create User Success!",
            user: newUser
        })
    } catch (e) {
        console.log("ERR: Register Error: ", e);
        next(e);
    }
}