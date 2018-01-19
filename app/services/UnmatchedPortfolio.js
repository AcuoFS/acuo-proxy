const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {GET_UNMATCHED_URL} = config

//import external library
const rp = require('request-promise')

// main object
const UnmatchedPortfolio = {}

UnmatchedPortfolio.get = (clientID) => {
  const uri = `${GET_UNMATCHED_URL}/${clientID}`
  return rp({uri, json: true}).then(response => {
    console.log('unmatched portfolio returned')
    return response
  })
}

module.exports = UnmatchedPortfolio
