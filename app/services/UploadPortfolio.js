/**
 * Created by Rui on 20/6/17.
 */
const config = require('../constants/config').get(process.env.DOCKER_ENV)
const _ = require('lodash')
const rp = require('request-promise')
const request = require('request')

const {
  POST_UPLOAD_PORTFOLIO,
  REQUEST_VALUATION,
  REQUEST_GENERATE_MARGINCALLS,
  REQUEST_SEND_MARGIN_CALLS
} = config

const UploadPortfolio = {}

UploadPortfolio.postUpload = (options, clientId) =>
  rp(`${POST_UPLOAD_PORTFOLIO}/${clientId}`, options)
    .then(response => {
      console.log('server responded to portfolio upload')
      // console.log(response)
      console.log(JSON.parse(response.toJSON().body))
      return JSON.parse(response.toJSON().body)
    })
    .catch(error => {
      console.log('encountered error')
      return error
    })

UploadPortfolio.postRequestValuation = (body, clientId) =>
  rp({
    url: `${REQUEST_VALUATION}/${clientId}`,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'content-type': 'application/json'},
    resolveWithFullResponse: true
  }).then(response => {
    //console.log(response)
    //   if(response.ok)
    return response
  })

UploadPortfolio.postGenerateMarginCall = (body, clientId) =>
  rp({
    url: `${REQUEST_GENERATE_MARGINCALLS}/${clientId}`,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'content-type': 'application/json'},
    resolveWithFullResponse: true
  }).then(response => {
    //console.log(response)
    //   if(response.ok)
    return response
  })

UploadPortfolio.postSendMarginCalls = (body, clientId) =>
  rp({
    url: `${REQUEST_SEND_MARGIN_CALLS}`,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'content-type': 'application/json'},
    resolveWithFullResponse: true
  }).then(response => response)

module.exports = UploadPortfolio