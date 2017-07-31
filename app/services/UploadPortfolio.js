/**
 * Created by Rui on 20/6/17.
 */
const config = require('../constants/config').get(process.env.DOCKER_ENV)
const _ = require('lodash')
const rp = require('request-promise')
const request = require('request')

const {
  POST_UPLOAD_PORTFOLIO,
  REQUEST_VALUATION
} = config

const UploadPortfolio = {}

UploadPortfolio.postUpload = (options) =>
  rp(POST_UPLOAD_PORTFOLIO, options)
    .then(response => {
      console.log('server responded')
      console.log(JSON.parse(response.toJSON().body))
      return JSON.parse(response.toJSON().body)
    })
    .catch(error => {
      console.log('encountered error')
      return error
    })

UploadPortfolio.postRequestValuation = (body) =>
  rp({
    url: REQUEST_VALUATION,
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'content-type': 'application/json'},
    resolveWithFullResponse: true
  }).then(response => {
    //console.log(response)
    //   if(response.ok)
    return response
  })

module.exports = UploadPortfolio