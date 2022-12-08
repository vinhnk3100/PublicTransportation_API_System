const Router = require("express").Router();
const roleValidation = require("../validations/role.validation")
const vehicleController = require("../controllers/vehicle.controller")

// Get all vehicles
Router.get('/', roleValidation.staff, vehicleController.get)

// Get vehicle by id
Router.get("/:vehicleId", roleValidation.admin, vehicleController.getById)

// Create Vehicle
Router.post("/create", roleValidation.admin, vehicleController.create)


// Delete
Router.delete('/:vehicleId', roleValidation.admin, vehicleController.delete)

module.exports = Router