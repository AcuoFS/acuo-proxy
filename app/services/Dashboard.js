// import external library
const rp = require('request-promise')
const _ = require('lodash')

// cache
const cache = require('../common/Cache')

// main object
const Dashboard = {}

// get Dashboard items
Dashboard.get = () => {
  return rp('http://margin.acuo.com/acuo/api/margin/dashboard')
    .then(JSON.parse)
    .then(json => {
      cache.set('dashboard', json)
      return json
    })
}

Dashboard.getFromCache = () => {
  return cache.get('dashboard').then(data => _.set(data, 'fromCache', true))
}

module.exports = Dashboard
