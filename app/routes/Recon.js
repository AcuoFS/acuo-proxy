// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { ReconService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "recon"

// ======================================================================
routerInstance.get('/', (req, res, next) => {
  const key = req.path()

  ReconService.get().then(data => {
    // hit backend
    FsCacheService.set({key, data})
    res.json({items:data})

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(items => res.json(_.set({items}, 'fromCache', true)))
  })
})

routerInstance.get('/recon-test-route', (req, res, next) => {
  ReconService.getTestRecon().then(data => {
    res.json({items:data.items})
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
