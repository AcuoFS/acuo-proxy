//import external library
const rp = require('request-promise')
// cache
const cache = require('../common/Cache')

// main object
const Recon = {}

// get Recon items
Recon.get = () => {
  return rp('http://margin.acuo.com/acuo/api/margin/items/all/999')
    .then(JSON.parse)
    .then(json => {
      cache.set('recon', json)
      return json
    })
}

Dashboard.getFromCache = () => {
  return cache.get('recon').then(data => _.set(data, 'fromCache', true))
}

module.exports = Recon
