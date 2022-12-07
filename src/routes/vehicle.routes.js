const Router = require("express").Router();
const roleValidation = require("../validations/role.validation")

// Get all vehicle
Router.get('/', roleValidation.admin, vehicleController.get)

// Create Vehicle
Router.post("/", roleValidation.admin, vehicleController.create)