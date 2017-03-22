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
  console.log('before dashboard get: ' + DashboardService.get())
  DashboardService.get().then(data => {
    // hit backend
    console.log('inside get: ' + data)
    let { derivatives, timeUpdated } = data

    derivatives = _.map(derivatives, (derivative => {
      return _.set(derivative, 'marginStatus', _.filter(derivative.marginStatus, (margin => {
        const excludedStatus = ['matchedtoreceived', 'waitdispute', 'partialdispute']
        return !excludedStatus.includes(margin.status)
      })))
    }))
    console.log('derivatives: ' + derivatives)
    derivatives = JSON.parse(JSON.stringify(derivatives).replace(/(ActionDispute|actiondispute)/g, "dispute"))

    FsCacheService.set({key, data: derivatives})
    res.send({derivatives, timeUpdated})

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(data => res.json({derivatives: data, fromCache: true}))
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
