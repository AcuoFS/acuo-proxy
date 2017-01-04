//import external library
const rp = require('request-promise')
const _ = require('lodash')
// cache
const cache = require('../common/Cache')

// main object
const Pledge = {}

// get Pledge items
Pledge.get = () => {
  return rp('http://margin.acuo.com/acuo/api/pledge/settings/optimization/999')
    .then(JSON.parse)
    .then(json => {
      cache.set('pledge', json)
      return json
    })
}

Dashboard.getFromCache = () => {
  return cache.get('pledge').then(data => _.set(data, 'fromCache', true))
}

Pledge.getInitCollateral = () => new Promise((resolve, reject) => {
  const rawInitCollateral = require('../json/initCollateral')
  const data = _.get(rawInitCollateral, 'data')

  resolve(data)
})

Pledge.getInitSelection = () => new Promise((resolve, reject) => {
  const rawInitSelection = require('../json/initSelection')
  const data = _.get(rawInitSelection, 'data')

  resolve(data)
})

Pledge.allocateSelection = () => new Promise((resolve, reject) => {
  const rawAllocateSelection = require('../json/allocateSelection')
  const data = _.get(rawAllocateSelection, 'data')

  resolve(data)
})

module.exports = Pledge
