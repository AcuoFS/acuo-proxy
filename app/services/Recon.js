//import external library
const rp = require('request-promise')

// main object
const Recon = {}

// get forex items
Recon.get = () => {
  return rp('http://margin.acuo.com/acuo/api/margin/items/all/999').then(JSON.parse)
}

module.exports = Recon
