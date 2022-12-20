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
    },
    history_purchase: [
        {
            message: {type: String, default: null},
            data_purchase: {type: Object, default: null}
        }
    ]
})

const User = mongoose.model('Users', UserSchema)

module.exports = User;