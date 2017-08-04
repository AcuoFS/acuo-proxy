/**
 * Created by Rui on 31/7/17.
 */

const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {
  GET_DEPLOYED_DEPARTURES
} = config

//import external library
const rp = require('request-promise')

// main object
const Deployed = {}

Deployed.getDepartures = () => {
  const uri = GET_DEPLOYED_DEPARTURES
  return rp({uri, json: true}).then(response => {
    console.log('get deployed departures returned')
    console.log(response)
    return response
  })
}


module.exports = Deployed