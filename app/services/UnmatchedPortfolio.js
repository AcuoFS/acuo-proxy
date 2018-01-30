const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {GET_UNMATCHED_URL} = config

//import external library
const rp = require('request-promise')

// main object
const UnmatchedPortfolio = {}

UnmatchedPortfolio.get = (clientId) => {
  const uri = `${GET_UNMATCHED_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true}).then(response => {
    console.log('unmatched portfolio returned')
    return response
  })
}

module.exports = UnmatchedPortfolio
