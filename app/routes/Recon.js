// import libs
const Router = require('restify-router').Router
// import services
const { ReconService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "recon"

// ======================================================================
routerInstance.get('/', (req, res, next) => {
  ReconService.get()
  .then(data => res.send(data))
  .catch(err => {
    ReconService.getFromCache()
      .then(data => res.send(data))
      .catch(err => res.json(404, {msg: 'failed to get data for first time'}))
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
