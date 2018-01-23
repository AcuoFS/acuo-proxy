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

routerInstance.post('/uploadPortfolio/:clientID', (req, res, next) => {
  console.log('attempting upload portfolio')

  let form = new FormData();

  const clientID = req.params.clientID

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
  UploadPortfolioService.postUpload(options, clientID)
    .then(response => res.send(response))
  console.log('response returned')
})

routerInstance.post('/request-valuation', (req, res, next) => {
  console.log('attempting portfolio valuation')
  console.log(req.body)
  const clientID = JSON.parse(req.body).clientID
  // console.log(clientID)
  UploadPortfolioService.postRequestValuation(req.body, clientID)
    .then(response => {
      console.log('responding with :')
      console.log(JSON.parse(response.toJSON().body))
      res.send(JSON.parse(response.toJSON().body))
      console.log('response returned')
    })
})

routerInstance.post('/request-margincalls', (req, res, next) => {
  console.log('attempting portfolio margin call generation')
  console.log(req.body)
  const clientID = JSON.parse(req.body).clientID

  UploadPortfolioService.postGenerateMarginCall(req.body, clientID)
    .then(response => {
      console.log('responding with :')
      console.log(JSON.parse(response.toJSON().body))
      res.send(JSON.parse(response.toJSON().body))
      console.log('response returned')
    })
})

// routerInstance.post('/testroute', (req, res, next) => {
//   console.log('here')
//   console.log(req)
// })

routerInstance.post('/send-margin-calls', (req, res, next) => {
  console.log('attempting to send margin calls')
  console.log(req.body)
  const clientID = JSON.parse(req.body).clientID

  UploadPortfolioService.postSendMarginCalls(req.body, clientID)
    .then(response => {
      console.log('responding with :')
      console.log(JSON.parse(response.toJSON().body))
      res.send(JSON.parse(response.toJSON().body))
      console.log('response returned')
    })
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)