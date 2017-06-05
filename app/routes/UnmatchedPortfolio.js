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
  console.log('requesting unmatched portfolios')
  const key = req.path()

  UnmatchedPortfolioService.get().then(data => {
    console.log('unmatched portfolio URL resolved')
    // FsCacheService.set({key, data})
    res.json({ items:data })
    console.log('unmatched portfolio returned')
  }).catch(err => {
    // hit cache
    // FsCacheService.get(key).then(items => res.json(_.set({items}, 'fromCache', true)))
    console.log('unmatched portfolio URL did not resolve')
    console.log(err)
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
