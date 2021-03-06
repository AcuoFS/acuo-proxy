const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {
  GET_OPTIMISATION_URL,
  GET_PLEDGE_SELECTIONS_URL,
  GET_COLLATERAL_URL,
  GET_EARMARKED_COLLATERAL_URL,
  POST_PLEDGE_SELECTIONS_URL,
  POST_PLEDGE_ALLOCATIONS_URL,
  POST_REMOVE_ALLOCATED_ASSET
} = config

//import external library
const rp = require('request-promise')
const _ = require('lodash')

// main object
const Pledge = {}

// =============================================================================
//
Pledge.getOptimisation = (clientId) => {
  const uri = `${GET_OPTIMISATION_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true})
}

Pledge.getInitCollateral = () => new Promise(resolve => {
  const json = require('../json/initCollateral')
  resolve(json)
})

Pledge.getInitSelection = (clientId) => {
  const uri = `${GET_PLEDGE_SELECTIONS_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true})
}

Pledge.getAllocatedAssets = (clientId) => new Promise (resolve => {
  const json = require('../json/allocatedAssets')
  resolve(json)
})

Pledge.getAllocatedAssetsNew = () => new Promise (resolve => {
  const json = require('../json/respAllocated_newFormat')
  resolve(json)
})

/**
 * format:
 *{
  "optimisationSettings": [
    {
      "name": "operations",
      "rating": 7.2
    },
    {
      "name": "liquidity",
      "rating": 3.5
    },
    {
      "name": "cost",
      "rating": 5.4
    }
  ],
  "toBeAllocated": [
    "mcp1",
    "mcp3",
    "mcp7"
  ]
}
 * @param reqBody
 */
Pledge.postSelection = (reqBody) => {
  return rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: POST_PLEDGE_SELECTIONS_URL,
    body: reqBody,
    json: true,
    resolveWithFullResponse: true
  }).then(response => {
    console.log('post selection returned')
    return response
  })
}

Pledge.postRemoveAllocated = (reqBody) => {
  return rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: POST_REMOVE_ALLOCATED_ASSET,
    body: reqBody,
    json: true,
    resolveWithFullResponse: true
  }).then(response => {
    console.log('post remove allocated returned')
    return response
  })
}

Pledge.postPledgeAllocation = (reqBody) => {
  return rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: POST_PLEDGE_ALLOCATIONS_URL,
    body: reqBody,
    json: true,
    // Use full response to check status code
    resolveWithFullResponse: true
  }).then(response => {
    console.log('pledge returned')
    return response
  })
}

Pledge.asset = (clientId) => {
  const uri = `${GET_COLLATERAL_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true})
}

Pledge.earmarked = (clientId) => {
  const uri = `${GET_EARMARKED_COLLATERAL_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true})
}

Pledge.allocateSelection = () => new Promise(resolve => {
  const json = require('../json/allocateSelection')
  resolve(json)
})

// =============================================================================
//
Pledge.calculateCase = (optimisationSetting) => new Promise(resolve => {
  const sum = _(optimisationSetting).reduce((sum, item) => {
    return sum + Number(_.get(item, 'rating', 0))
  }, 0)

  const sorted = _.sortBy(optimisationSetting, ['rating'])
  const highest = _.last(sorted)
  const highestScore = highest.rating / sum

  const caseCode = (highestScore > 0.5)
    ? highest.name.slice(0, 1).toUpperCase()
    : 'A'

  resolve(caseCode)
})

Pledge.allocateAssets = (item, caseCode, assets) => {
  const guid = item.GUID

  const initialMargin = _.filter(assets, {GUID: guid, caseCode, type: 'initialMargin'})
    .map(asset => _.set(asset, 'valuePostHaircutOriginal', (asset.valuePostHaircut / asset.FX)))

  const variationMargin = _.filter(assets, {GUID: guid, caseCode, type: 'variationMargin'})
    .map(asset => _.set(asset, 'valuePostHaircutOriginal', (asset.valuePostHaircut / asset.FX)))

  const initialMarginTotal = _.sumBy(initialMargin, 'valuePostHaircutOriginal')
  const variationMarginTotal = _.sumBy(variationMargin, 'valuePostHaircutOriginal')
  const marginTotal = initialMarginTotal + variationMarginTotal

  return _.merge(item, {allocated : {
    caseCode,
    // margin items
    initialMargin,
    variationMargin,
    // sub-totals and total
    initialMarginTotal,
    variationMarginTotal,
    marginTotal,
  }})
}

module.exports = Pledge
