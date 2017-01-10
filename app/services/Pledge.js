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

Pledge.getInitSelection = () => {
  const uri = 'http://margin.acuo.com/acuo/api/pledge/items/all/999'
  return rp({uri, json: true})
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

module.exports = Pledge
