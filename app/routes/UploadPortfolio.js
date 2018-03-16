// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UploadPortfolioService, CommonService } = require('../services')
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

routerInstance.post('/uploadPortfolio/:clientId', (req, res, next) => {
  console.log('attempting upload portfolio')

  let form = new FormData();

  const clientId = req.params.clientId

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

  // CommonService.authTokenValidation(req.headers.authorization).then(response => {
  //   if(response.statusCode === 498){
  //     console.log('****** AUTH EXPIRED *******')
  //     res.send(498)
  //   }

    UploadPortfolioService.postUpload(options, clientId)
      .then(response => {
        // res.header("authorization", response.headers.authorization)
        res.send(response)
        console.log('response returned')
      })
  // }).catch(err => res.send(401))
})

routerInstance.post('/request-valuation', (req, res, next) => {
  console.log('attempting portfolio valuation')
  console.log(req.body)
  const { clientId } = req.body
  // console.log(clientId)

  CommonService.authTokenValidation(req.headers.authorization).then(response => {
    if(response.statusCode === 498){
      console.log('****** AUTH EXPIRED *******')
      res.send(498)
    }

    UploadPortfolioService.postRequestValuation(req.body, clientId)
      .then(response => {
        console.log('responding with :')
        console.log(response.body)
        console.log(JSON.parse(response.toJSON().body))
        // res.header("authorization", response.headers.authorization)
        res.send(JSON.parse(response.toJSON().body))
        console.log('response returned')
      })
  }).catch(err => res.send(401))

})

routerInstance.post('/request-margincalls', (req, res, next) => {
  console.log('attempting portfolio margin call generation')
  console.log(req.body)
  const { clientId } = req.body

  CommonService.authTokenValidation(req.headers.authorization).then(response => {
    if(response.statusCode === 498){
      console.log('****** AUTH EXPIRED *******')
      res.send(498)
    }

    UploadPortfolioService.postGenerateMarginCall(req.body, clientId)
      .then(response => {
        console.log('responding with :')
        console.log(JSON.parse(response.toJSON().body))
        // res.header("authorization", response.headers.authorization)
        res.send(JSON.parse(response.toJSON().body))
        console.log('response returned')
      })
  }).catch(err => res.send(401))

})

// routerInstance.post('/testroute', (req, res, next) => {
//   console.log('here')
//   console.log(req)
// })

routerInstance.post('/send-margin-calls', (req, res, next) => {
  console.log('attempting to send margin calls')
  console.log(req.body)
  const { clientId } = req.body

  CommonService.authTokenValidation(req.headers.authorization).then(response => {
    if(response.statusCode === 498){
      console.log('****** AUTH EXPIRED *******')
      res.send(498)
    }

    UploadPortfolioService.postSendMarginCalls(req.body, clientId)
      .then(response => {
        console.log('responding with :')
        console.log(JSON.parse(response.toJSON().body))
        // res.header("authorization", response.headers.authorization)
        res.send(JSON.parse(response.toJSON().body))
        console.log('response returned')
      })
  }).catch(err => res.send(401))

})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)