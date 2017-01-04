// import libs
const Router = require('restify-router').Router
// import services
const { DashboardService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "dashboard"

// ======================================================================
// [GET] /users
routerInstance.get('/', (req, res, next) => {

})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
