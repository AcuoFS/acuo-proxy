const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {GET_UNMATCHED_URL} = config

//import external library
const rp = require('request-promise')

// main object
const UnmatchedPortfolio = {}

UnmatchedPortfolio.get = () => {
  const uri = GET_UNMATCHED_URL
  return rp({uri, json: true}).then(reponse => console.log('unmatched portfolio returned'))
}

module.exports = UnmatchedPortfolio
