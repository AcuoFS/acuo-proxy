// import libs
const Router = require('restify-router').Router
// import services
const { DashboardService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "dashboard"

// ======================================================================
routerInstance.get('/', (req, res, next) => {
  DashboardService.get()
    .then(data => res.send(data))
    .catch(err => {
      DashboardService.getFromCache()
        .then(data => res.send(data))
        .catch(err => res.json(404, {msg: 'failed to get data for first time'}))
    })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
