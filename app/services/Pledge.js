//import external library
const rp = require('request-promise')
const _ = require('lodash')
// cache
const cache = require('../common/Cache')

// main object
const Pledge = {}

// get Pledge items
Pledge.get = (path) => {
  return rp('http://margin.acuo.com/acuo/api/pledge/settings/optimization/999')
    .then(data => ({items: JSON.parse(data)}))
    .then(json => {
      cache.set(path, json)
      return json
    })
}

Pledge.getFromCache = (path) => {
  console.log(path)
  return cache.get(path).then(data => _.set(data, 'fromCache', true))
}

Pledge.getInitCollateral = () => new Promise((resolve, reject) => {
  const rawInitCollateral = require('../json/initCollateral')
  const data = _.get(rawInitCollateral, 'data')

  resolve(data)
})

Pledge.getInitSelection = (path) => {
  return rp('http://margin.acuo.com/acuo/api/pledge/items/all/999')
    .then(data => ({items: JSON.parse(data)}))
    .then(json => {
      cache.set(path, json)
      return json
    })
}

Pledge.allocateSelection = () => new Promise((resolve, reject) => {
  const rawAllocateSelection = require('../json/allocateSelection')
  const data = _.get(rawAllocateSelection, 'data')

  resolve(data)
})

module.exports = Pledge
