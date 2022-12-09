const Router = require('express').Router()
const roleValidation = require("../validations/role.validation")
const routeController = require("../controllers/route.controller")

// Get route
Router.get('/', roleValidation.staff, routeController.get)

// Get Route by Id
Router.get("/:routeId", roleValidation.admin, routeController.getById)

// Create route
Router.post('/create', roleValidation.admin, routeController.create)

// Delete route
Router.delete('/:routeId', roleValidation.admin, routeController.delete)


module.exports = Router