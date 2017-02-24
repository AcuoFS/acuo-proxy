const {GET_UNMATCHED_URL} = require('../constants/endpoints-dev')

//import external library
const rp = require('request-promise')

// main object
const UnmatchedPortfolio = {}

UnmatchedPortfolio.get = () => {
  const uri = GET_UNMATCHED_URL
  return rp({uri, json: true})
}

module.exports = UnmatchedPortfolio
