const {GET_RECON_URL} = require('../constants/endpoints')

//import external library
const rp = require('request-promise')

// main object
const Recon = {}

// get Recon items
Recon.get = () => {
  const uri = GET_RECON_URL
  return rp({uri, json: true})
}

Recon.getTestRecon = () => new Promise(resolve => {
  const json = require('../json/reconItems-new.json')
  resolve(json)
})


module.exports = Recon
