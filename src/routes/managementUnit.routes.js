const Router = require("express").Router();
const roleValidation = require("../validations/role.validation");
const managementUnitController = require("../controllers/managementUnit.controller");

// Get all Management Units
Router.get('/', roleValidation.admin, managementUnitController.get);

// Get management unit by id
Router.get('/:mgtUnitId', roleValidation.admin, managementUnitController.getById);

// Create management unit
Router.post('/create', roleValidation.admin, managementUnitController.create);

// Update management unit
Router.put('/:mgtUnitId', roleValidation.admin, managementUnitController.update);

// Delete management unit
Router.delete('/:mgtUnitId', roleValidation.admin, managementUnitController.delete);

module.exports = Router;