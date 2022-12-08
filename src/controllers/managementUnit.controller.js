// Management Unit Controller: Get - Create - Update - Delete

const ManagementUnitModel = require("../models/ManagementUnit.model")

// Get
exports.get = async (req, res, next) => {
    try {
        const mgtUnit = await ManagementUnitModel.find({}).lean().exec()

        if (!mgtUnit || mgtUnit.length < 1) {
            return res.json({
                success: true,
                message: "No Management Unit existed!"
            })
        }

        return res.json({
            success: true,
            message: "Management Units found!",
            total_management_unit: mgtUnit.length,
            management_units: mgtUnit
        })
    } catch (e) {
        console.log("ERR: Find Management Units Error: ", e);
        next(e);
    }
}

// Create
exports.create = async (req, res, next) => {
    const { mgtunit_name } = req.body;

    try {
        const newMgtUnit = await ManagementUnitModel.create({
            mgtunit_name: mgtunit_name
        })

        return res.json({
            success: true,
            message: "ManagementUnitController: Create Management Unit Success!",
            mgt_unit: newMgtUnit
        })

    } catch (e) {
        console.log("ERR: Create Management Units Error: ", e);
        next(e);
    }
}


// Delete
exports.delete = async (req, res, next) => {
    const { mgtunitId } = req.params;

    try {
        const mgtunit = await ManagementUnitModel.findByIdAndDelete({ _id: mgtunitId })

        if (!mgtunit || mgtunit.length < 1) {
            return res.json({
                success: false,
                message: "Management Unit not existed!"
            })
        }

        return res.json({
            success: true,
            message: `Management Unit ${mgtunitId} deleted!`
        })
    } catch (e) {
        console.log("ERR: Create Management Units Error: ", e);
        next(e);
    }
}