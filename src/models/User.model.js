const mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        default: null,
    },
    fullname: {
        type: String,
        default: null,
    },
    password: String,
    phoneNumber: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        default: 'customer'
    },
    wallet: {
        type: Number,
        default: 0,
        required: true
    }
    // ticket_history: {}
})

const User = mongoose.model('Users', UserSchema)

module.exports = User;