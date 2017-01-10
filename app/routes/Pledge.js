// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
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
  const key = req.path()

  Promise.all([PledgeService.asset(), PledgeService.earmarked()]).then(data => {
    // hit backend
    const [detailedAssets, {earmarked}] = data
    const {"MM Instruments": mmInstruments,
           "Sovereign Bonds": sovereignBonds,
           "Corporate Equity": corporateEquity,
           "CASH": cash} = detailedAssets

    const assets = { earmarked, cash, mmInstruments, sovereignBonds, corporateEquity }

    FsCacheService.set({key, data: assets})
    res.send(assets)

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(items => {
      console.log(items)
      res.send(Object.assign({},items, {fromCache: true})
    })
  })
})

routerInstance.get('/init-selection', (req, res, next) => {
  const key = req.path()

  PledgeService.getInitSelection().then(data => {
    // hit backend
    FsCacheService.set({key, data})
    res.send({items:data})

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(items => res.json({items, fromCache: true}))
  })
})

routerInstance.get('/init-collateral', (req, res, next) => {
  PledgeService.getInitCollateral().then(data => res.send(data))
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
