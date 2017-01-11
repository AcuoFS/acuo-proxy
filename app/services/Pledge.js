//import external library
const rp = require('request-promise')
const _ = require('lodash')

// main object
const Pledge = {}

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
Pledge.calculateCase = (optimisationSetting) => new Promise(resolve => {
  const sum = _(optimisationSetting).reduce((sum, item) => {
    return sum + _.get(item, 'rating', 0)
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
  const GUID = item.GUID
  const initialMargin = _.filter(assets, {GUID, caseCode, type:'initialMargin'})
  const variationMargin = _.filter(assets, {GUID, caseCode, type:'variationMargin'})

  return _.set(item, 'allocated', {initialMargin, variationMargin})
}

module.exports = Pledge
