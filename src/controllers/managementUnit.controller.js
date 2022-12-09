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

// Get Management Unit by Id
exports.getById = async (req, res, next) => {
    const { mgtUnitId } = req.params;

    try {
        const mgtUnit = await ManagementUnitModel.findById({ _id: mgtUnitId }).lean().exec();
        if (!mgtUnit || mgtUnit < 1) {
            return res.json({
                success: true,
                message: "No Management Unit existed!"
            })
        }

        return res.json({
            success: true,
            message: "Management Units found!",
            management_unit: mgtUnit
        })
    } catch (e) {
        console.log("ERR: Find Management Units Error: ", e);
        next(e);
    }
}

// Update Management Unit
exports.update = async (req, res, next) => {
    const { mgtUnitId } = req.params;
    const update = req.body;

    try {
        let updateMgtUnit = await ManagementUnitModel.findByIdAndUpdate({ _id: mgtUnitId }, update, { new: true }).exec();

        if (!updateMgtUnit || updateMgtUnit.length < 1) {
            return res.json({
                success: true,
                message: "No management unit existed right now!"
            })
        }

        await updateMgtUnit.save();

        return res.json({
            success: true,
            message: `Management Unit ${mgtUnitId} updated!`,
            management_unit: updateMgtUnit
        })
    } catch (e) {
        console.log("ERR: Update Management Units Error: ", e);
        next(e);
    }
}

// Delete
exports.delete = async (req, res, next) => {
    const { mgtUnitId } = req.params;

    try {
        const mgtunit = await ManagementUnitModel.findByIdAndDelete({ _id: mgtUnitId }).exec();

        if (!mgtunit || mgtunit.length < 1) {
            return res.json({
                success: false,
                message: "Management Unit not existed!"
            })
        }

        return res.json({
            success: true,
            message: `Management Unit ${mgtUnitId} deleted!`
        })
    } catch (e) {
        console.log("ERR: Delete Management Units Error: ", e);
        next(e);
    }
}