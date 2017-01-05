//import external library
const rp = require('request-promise')
// const _ = require('lodash')
// cache
const cache = require('../common/Cache')

// main object
const Recon = {}

// get Recon items
Recon.get = () => {
  return rp('http://margin.acuo.com/acuo/api/margin/items/all/999')
    .then(data => ({items: JSON.parse(data)}))
    .then(json => {
      cache.set('recon', json)
      return json
    })
}

Recon.getFromCache = () => {
  return cache.get('recon').then(data => _.set(data, 'fromCache', true))
}

module.exports = Recon
