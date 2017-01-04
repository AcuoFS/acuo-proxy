//import external library
const rp = require('request-promise')

// main object
const Pledge = {}

// get forex items
Pledge.get = () => {
  return rp('http://margin.acuo.com/acuo/api/pledge/settings/optimization/999').then(JSON.parse)
}

module.exports = Pledge
