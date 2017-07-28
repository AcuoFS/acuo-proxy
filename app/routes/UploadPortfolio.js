// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UploadPortfolioService, FsCacheService } = require('../services')
// const multiparty = require('multiparty')
const request = require('request')
const fs = require('fs')
// const multer = require('multer')
var FormData = require('form-data')
const rp = require('request-promise')

// main object
const routerInstance = new Router()

// constants
const prefix = "upload"

const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {
  POST_UPLOAD_PORTFOLIO
} = config

// var upload = multer({dest: 'json/'})

routerInstance.post('/', (req, res, next) => {
  console.log('attempting upload portfolio')

  let form = new FormData();

  console.log('preparing files to send')
  Object.keys(req.files).map(x => {
    let file = req.files[x];
    let buffer = fs.readFileSync(file.path);
    form.append('file', buffer, file.name)
  })

  const options = {
    method: 'POST',
    headers: form.getHeaders(),
    body: form,
    resolveWithFullResponse: true
  }

  console.log('sending files')
  rp(POST_UPLOAD_PORTFOLIO, options)
    .then(response => {
      console.log('server responded')
      console.log(JSON.parse(response.toJSON().body))
      res.send(JSON.parse(response.toJSON().body))
      console.log('response returned')
    })
    .catch(error => {
      console.log('encountered error')
      res.send(error)
    })
})

routerInstance.post('/testroute', (req, res, next) => {
  console.log('here')
  console.log(req)
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)