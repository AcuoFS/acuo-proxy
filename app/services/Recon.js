const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {
  GET_RECON_URL,
  GET_RECON_DISPUTES_URL,
  POST_RECON_DISPUTE_URL
} = config

//import external library
const rp = require('request-promise')

// main object
const Recon = {}

// get Recon items
Recon.get = () => {
  const uri = GET_RECON_URL
  return rp({uri, json: true}).then(response => console.log('get all recon returned'))
}

Recon.getTestRecon = () => new Promise(resolve => {
  const json = require('../json/reconItems-new.json')
  resolve(json)
})

Recon.getReconDisputes = () => {
  const uri = GET_RECON_DISPUTES_URL
  return rp({uri, json: true}).then(response => console.log('get recon disputes returned'))
}

Recon.postReconDispute = (reqBody) => {
  return rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: POST_RECON_DISPUTE_URL,
    body: reqBody,
    json: true,
    // Use full response to check status code
    // resolveWithFullResponse: true
  }).then(response => console.log('post recon dispute returned'))
}

module.exports = Recon
