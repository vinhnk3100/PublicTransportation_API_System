const Router = require('express').Router();
const routeController = require("../controllers/route.controller")

const roleValidation = require("../validations/role.validation")
const routeValidation = require("../validations/route.validation")
const tokenValidation = require("../middlewares/auth.middleware")

// Get route
Router.get('/', routeController.get);

// Get Route by Id
Router.get("/:routeId", routeController.getById);

// Create route
Router.post('/create',
    tokenValidation.verifyValidRefreshToken,
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    routeValidation.createRouteValidation,
    routeValidation.filterInvalidVehicle,
    routeController.create
);

// Delete route
Router.delete('/:routeId',
    tokenValidation.verifyValidRefreshToken,
    tokenValidation.verifyValidAccessToken,
    roleValidation.admin,
    routeController.delete
);


module.exports = Router;