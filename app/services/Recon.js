const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {
  GET_RECON_URL,
  GET_RECON_DISPUTES_URL,
  POST_RECON_DISPUTE_URL,
  GET_RECONCILE_URL
} = config

//import external library
const rp = require('request-promise')

// main object
const Recon = {}

// get Recon items
Recon.get = (clientId) => {
  const uri = `${GET_RECON_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true})
    .then(response => {
      console.log('get all recon returned')
      return response
    })
}

Recon.getTestRecon = () => new Promise(resolve => {
  const json = require('../json/reconItems-new.json')
  resolve(json)
})

Recon.getReconDisputes = (clientId) => {
  const uri = `${GET_RECON_DISPUTES_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true}).then(response => {
    console.log('get recon disputes returned')
    return response
  })
}

Recon.postReconDispute = (reqBody) => {
  return rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: POST_RECON_DISPUTE_URL,
    body: reqBody,
    json: true,
    // Use full response to check status code
    resolveWithFullResponse: true
  }).then(response => {
    console.log('post recon dispute returned')
    return response
  })
}

Recon.getReconcile = (params) => {
  return rp({
    method: 'GET',
    headers: {'content-type': 'application/json'},
    uri: `${GET_RECONCILE_URL}/${params}`,
    json: true,
    // Use full response to check status code
    resolveWithFullResponse: true
  }).then(response => {
    console.log('GET recon returned')
    return response
  })
}

module.exports = Recon
