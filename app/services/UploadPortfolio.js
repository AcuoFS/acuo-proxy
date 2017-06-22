/**
 * Created by Rui on 20/6/17.
 */
const config = require('../constants/config').get(process.env.DOCKER_ENV)
const _ = require('lodash')
const rp = require('request-promise')

const {
  POST_UPLOAD_PORTFOLIO
} = config

//, '_url': {'pathname': POST_UPLOAD_PORTFOLIO, 'path': POST_UPLOAD_PORTFOLIO, 'href': POST_UPLOAD_PORTFOLIO}, '_cacheURL': POST_UPLOAD_PORTFOLIO}

const UploadPortfolio = {}

UploadPortfolio.postUpload = (req) => {
  const newReq = _.assign({}, req, {'url': POST_UPLOAD_PORTFOLIO, 'body': ''})
  //console.log(newReq)
  return rp(newReq)
}

module.exports = UploadPortfolio