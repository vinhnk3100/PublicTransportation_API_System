const UserModel = require('../models/User.model');
const bcrypt = require('bcrypt');

// get
const getUser = async () => {
    try {
        return await UserModel.find({}).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

// Feature: Authorize Login - Return User base on input from login account (phone number || username)
const getAuthLoginUser = async (username) => {
    try {
        return await UserModel.findOne(isNaN(username) ? {username: username} : {phoneNumber: username}).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

// get by uid
const getUserById = async (userId) => {
    try {
        return await UserModel.find({ _id: userId }).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

// create
const createUser = async (username, fullname, password, phoneNumber, role, wallet) => {
    try {
        return await UserModel.create({
            username: username,
            fullname: fullname,
            password: bcrypt.hashSync(password, 10),
            phoneNumber: phoneNumber,
            role: role,
            wallet: 50000
        })
    } catch (e) {
        throw new Error(e.message)
    }
}


// update
const updateUser = async (userId, update) => {
    try {
        return await UserModel.findByIdAndUpdate({ _id: userId }, update, {
            new: true
        })
    } catch (e) {
        throw new Error(e.message)
    }
}


// delete
const deleteUser = async (userId) => {
    try {
        return await UserModel.findByIdAndDelete({ _id: userId })
    } catch (e) {
        throw new Error(e.message)
    }
}

// ========================================== Utilities Sections ==========================================

module.exports = {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAuthLoginUser
}