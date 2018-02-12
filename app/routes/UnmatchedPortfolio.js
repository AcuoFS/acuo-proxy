// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UnmatchedPortfolioService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "unmatched"

routerInstance.get('/:clientId', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting unmatched portfolios')
  const key = req.path()

  UnmatchedPortfolioService.get(req.params.clientId).then(data => {
    console.log('unmatched portfolio URL resolved')
    // FsCacheService.set({key, data})
    console.log('responding with: ----------')
    console.log({ items:data })
    console.log('---------------------------')
    res.json({ items:data })
    console.log('unmatched portfolio responded')
  }).catch(err => {
    // hit cache
    // FsCacheService.get(key).then(items => res.json(_.set({items}, 'fromCache', true)))
    console.log('unmatched portfolio URL did not resolve')
    console.log(err)
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
