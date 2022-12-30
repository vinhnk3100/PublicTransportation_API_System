const Router = require("express").Router();
const roleValidation = require("../validations/role.validation");
const vehicleController = require("../controllers/vehicle.controller");

// Get all vehicles
Router.get('/', vehicleController.get);

// Searching - Vehicle available (Not routing)
Router.get("/search", vehicleController.getAvailable);

// Get vehicle by id
Router.get("/:vehicleId", vehicleController.getById);

// Create Vehicle
Router.post("/create", roleValidation.admin, vehicleController.create);

// Update Vehicle
Router.put("/:vehicleId", roleValidation.admin, vehicleController.update);

// Delete Vehicle
Router.delete('/:vehicleId', roleValidation.admin, vehicleController.delete);

module.exports = Router;