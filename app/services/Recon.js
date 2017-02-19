//import external library
const rp = require('request-promise')

// main object
const Recon = {}

// get Recon items
Recon.get = () => {
  const uri = 'http://margin:7070/acuo/api/margin/items/all/999'
  return rp({uri, json: true})
}

Recon.getTestRecon = () => new Promise(resolve => {
  const json = require('../json/reconItems-new.json')
  resolve(json)
})


module.exports = Recon
