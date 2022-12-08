const Router = require("express").Router();
const roleValidation = require("../validations/role.validation")
const managementUnitController = require("../controllers/managementUnit.controller")

// Get all Management Units
Router.get('/', roleValidation.admin, managementUnitController.get)

// Create management unit
Router.post('/create', roleValidation.admin, managementUnitController.create)

// Delete management unit
Router.delete('/:mgtunitId', roleValidation.admin, managementUnitController.delete)

module.exports = Router