//import external library
const rp = require('request-promise')
const _ = require('lodash')

// main object
const Pledge = {}

// =============================================================================
//
Pledge.get = () => {
  const uri = 'http://margin.acuo.com/acuo/api/pledge/settings/optimization/999'
  return rp({uri, json: true})
}

Pledge.getInitCollateral = () => new Promise(resolve => {
  const json = require('../json/initCollateral')
  resolve(json)
})

Pledge.getInitSelection = () => {
  const uri = 'http://margin.acuo.com/acuo/api/pledge/items/all/999'
  return rp({uri, json: true})
}

Pledge.getAllocatedAssets = () => new Promise (resolve => {
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
    uri: 'http://collateral.acuo.com/acuo/api/optimization/allocate',
    body: reqBody,
    json: true
  })
}

Pledge.postPledgeAllocation = (reqBody) => {
  return rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: 'http://collateral.acuo.com/acuo/api/pledge',
    body: reqBody,
    json: true,
    // Use full response to check status code
    resolveWithFullResponse: true
  })
}

Pledge.asset = () => {
  const uri = 'http://collateral.acuo.com/acuo/api/assets/eligible/client/999'
  return rp({uri, json: true})
}

Pledge.earmarked = () => {
  const uri = 'http://collateral.acuo.com/acuo/api/assets/reserved/client/999'
  return rp({uri, json: true})
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
