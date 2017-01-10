// import libs
const Router = require('restify-router').Router
// import services
const { PledgeService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "pledge"

// ======================================================================
routerInstance.get('/optimization', (req, res, next) => {
  // get data
  const key = req.path()

  PledgeService.get().then(items => {
    // hit backend
    FsCacheService.set({key, data:items})
    res.json({items})

  }).catch(err => {
    // backend is down, get from cache
    FsCacheService.get(key).then(items => res.json({items, fromCache: true}))
  })
})

routerInstance.get('/allocate-selection', (req, res, next) => {
  PledgeService.allocateSelection().then(data => res.send(data))
})

routerInstance.get('/init-selection', (req, res, next) => {
  PledgeService.getInitSelection().then(data => res.send({data}))
})

routerInstance.get('/init-collateral', (req, res, next) => {
  PledgeService.getInitCollateral().then(data => res.send(data))
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
