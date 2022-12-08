const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ManagementUnitSchema = new Schema({
    mgtunit_name: {
        type: String,
        default: null
    }
}, { timestamps: true })

const ManagementUnit = mongoose.model("Management Units", ManagementUnitSchema)

module.exports = ManagementUnit;