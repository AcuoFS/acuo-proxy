// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UnmatchedPortfolioService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "unmatched"

routerInstance.get('/', (req, res, next) => {
  const key = req.path()

  UnmatchedPortfolioService.get().then(data => {
    FsCacheService.set({key, data})
    res.json({ items:data })
  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(items => res.json(_.set({items}, 'fromCache', true)))
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
