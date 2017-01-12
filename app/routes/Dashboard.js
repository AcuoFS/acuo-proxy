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
    const { derivatives, timeUpdated } = data
    const newDerivative = _.map(derivatives, (x => {
      return _.set(x, 'marginStatus', _.filter(x.marginStatus, (x => {
        const excludedStatus = ['matchedtoreceived', 'waitdispute', 'partialdispute']
        return !excludedStatus.includes(x.status)
      })))
    }))

    FsCacheService.set({key, newDerivative})
    res.send({derivatives: newDerivative, timeUpdated})

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(data => res.json(_.set(data, 'fromCache', true)))
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
