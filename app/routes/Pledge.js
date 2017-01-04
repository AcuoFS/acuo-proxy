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
  .catch(err => res.json(err.statusCode, {msg:'failed'}))
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
