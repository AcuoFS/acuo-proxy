/**
 * Created by Rui on 20/6/17.
 */
const config = require('../constants/config').get(process.env.DOCKER_ENV)

const {
  POST_UPLOAD_PORTFOLIO
} = config

const rp = require('request-promise')

const UploadPortfolio = {}

UploadPortfolio.postUpload = (reqBody) => {
  return rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: POST_UPLOAD_PORTFOLIO,
    body: reqBody,
    json: true,
    // Use full response to check status code
    // resolveWithFullResponse: true
  })
}

module.exports = UploadPortfolio