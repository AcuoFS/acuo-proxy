//import external library
const rp = require('request-promise')

// main object
const Recon = {}

// get Recon items
Recon.get = () => {
  const uri = 'http://margin.acuo.com/acuo/api/margin/items/all/999'
  return rp({uri, json: true})
}

module.exports = Recon
