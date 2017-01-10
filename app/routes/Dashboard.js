// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { DashboardService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "dashboard"

// ======================================================================
routerInstance.get('/', (req, res, next) => {
  const key = req.path()

  DashboardService.get().then(data => {
    // hit backend
    FsCacheService.set({key, data})
    res.send(data)

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(data => res.json(_.set(data, 'fromCache', true)))
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
