/**
 * Created by Rui on 20/6/17.
 */
const config = require('../constants/config').get(process.env.DOCKER_ENV)
const _ = require('lodash')
const rp = require('request-promise')
const multiparty = require('multiparty')

//require('request-debug')(rp)

const {
  POST_UPLOAD_PORTFOLIO
} = config

//, '_url': {'pathname': POST_UPLOAD_PORTFOLIO, 'path': POST_UPLOAD_PORTFOLIO, 'href': POST_UPLOAD_PORTFOLIO}, '_cacheURL': POST_UPLOAD_PORTFOLIO}

const UploadPortfolio = {}

UploadPortfolio.postUpload = (req) => {
  //const newReq = _.assign({}, req, {'url': 'http://localhost:8081/upload/testroute', 'body': JSON.stringify(req.body)})
  //console.log(JSON.stringify(req.body))

  //console.log(req.files)

  // const newReq = {
  //   method: 'POST',
  //   url: POST_UPLOAD_PORTFOLIO,
  //   headers: {
  //     connection: 'keep-alive',
  //     'content-length': req.headers['content-length'],
  //     pragma: 'no-cache',
  //     'cache-control': 'no-cache',
  //     'content-type': req.headers['content-type'],
  //     accept: 'application/json',
  //     'x-requested-with': 'XMLHttpRequest',
  //     'accept-encoding': 'gzip, deflate, br',
  //     'accept-language': 'en-US,en;q=0.8',
  //     'content-disposition': 'form-data; name="file"; filename="TradePortfolio.xlsx"'
  //   },
  //   files: req.files.file
  // }



  return rp(req)


}

module.exports = UploadPortfolio