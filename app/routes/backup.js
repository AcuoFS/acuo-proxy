'use strict'

const Router = require('restify-router').Router
const routerInstance = new Router()

const _ = require('lodash')

// ===================================
// To be changed when backend comes in
// Raw Data
const rawDerivativeActions = require('../json/derivativeActions')
const rawReconItems = require('../json/reconItems')
const rawInitCollateral = require('../json/initCollateral')
const rawInitSelection = require('../json/initSelection')
const rawAllocateSelection = require('../json/allocateSelection')
const rawOptimisation = require('../json/optimisation')

routerInstance.get('/derivative-actions', (req, res, next) => {
  const data = _.get(rawDerivativeActions, 'data')

  // END
  res.json({
    dataType: 'derivativeAction',
    data
  })
})


routerInstance.get('/recon-items', (req, res, next) => {
  const data = _.get(rawReconItems, 'data')

  // END
  res.json({
    dataType: 'reconItem',
    data
  })
})


routerInstance.get('/derivative-recon-items', (req, res, next) => {
  const derivativeActions = _.get(rawDerivativeActions, 'data')
  const reconItems = _.get(rawReconItems, 'data')

  // init data
  const data = []

  _(derivativeActions).each(action => {
    let GUID = action.GUID

    data.push(_.merge(action, {
      reconItems: _(reconItems).filter({GUID})
    }))
  })

  // END
  res.json({
    dataType: 'derivativeActionWithReconItems',
    data
  })
})

routerInstance.get('/optimisation', (req, res, next) => {
  const data = _.get(rawOptimisation, 'data')

  res.json({
    data
  })
})

routerInstance.get('/init-collateral', (req, res, next) => {
  const data = _.get(rawInitCollateral, 'data')

  res.json({
    data
  })
})

routerInstance.get('/init-selection', (req, res, next) => {
  const data = _.get(rawInitSelection, 'data')

  res.json({
    data
  })
})

routerInstance.post('/allocate-selection', (req, res, next) => {
  const data = _.get(rawAllocateSelection, 'data')

  console.log('req.data', req.data)
  req.on('data', (data)=>{
    console.log('on data', data)
  })

  res.json({
    data
  })
})

module.exports = (server) => routerInstance.applyRoutes(server)
