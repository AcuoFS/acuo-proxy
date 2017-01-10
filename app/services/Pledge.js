//import external library
const rp = require('request-promise')

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

Pledge.getInitSelection = () => new Promise(resolve => {
  const json = require('../json/initSelection')
  resolve(json)
})

Pledge.allocateSelection = () => new Promise(resolve => {
  const json = require('../json/allocateSelection')
  resolve(json)
})

module.exports = Pledge
