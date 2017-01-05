// import libs
const Router = require('restify-router').Router
// import services
const { PledgeService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "pledge"

// ======================================================================
routerInstance.get('/optimization', (req, res, next) => {
  PledgeService.get()
  .then(data => res.send(data))
  .catch(err => {
    PledgeService.getFromCache()
      .then(data => res.send(data))
      .catch(err => res.json(404, {msg: 'failed to get data for first time'}))
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
