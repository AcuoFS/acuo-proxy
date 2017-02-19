//import external library
const rp = require('request-promise')

// main object
const UnmatchedPortfolio = {}

UnmatchedPortfolio.get = () => {
  const uri = 'http://margin:7070/acuo/api/margin/items/unmatched/999'
  return rp({uri, json: true})
}

module.exports = UnmatchedPortfolio
