const ManagementUnitModel = require("../models/ManagementUnit.model")

const getMngtUnit = async () => {
    try {
        return await ManagementUnitModel.find({}).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getMngtUnitById = async (mgtUnitId) => {
    try {
        return await ManagementUnitModel.find({ _id: mgtUnitId }).lean().exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const createMngtUnit = async (mgtunit_name) => {
    try {
        return await ManagementUnitModel.create({
            mgtunit_name: mgtunit_name
        })
    } catch (e) {
        throw new Error(e.message)
    }
}

const updateMngtUnit = async (mgtUnitId, update) => {
    try {
        return await ManagementUnitModel.findByIdAndUpdate({ _id: mgtUnitId }, update, { new: true }).exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

const deleteMngtUnit = async (mgtUnitId) => {
    try {
        return await ManagementUnitModel.findByIdAndDelete({ _id: mgtUnitId }).exec();
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    getMngtUnit,
    getMngtUnitById,
    createMngtUnit,
    updateMngtUnit,
    deleteMngtUnit
}