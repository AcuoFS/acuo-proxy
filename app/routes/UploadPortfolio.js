// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UploadPortfolioService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "upload"

routerInstance.post('/', (req, res, next) => {
  console.log('attempting upload portfolio')
  // console.log(req)
  // let objToSend = req
  UploadPortfolioService.postUpload(req).then(data => {
    console.log('posting upload portfolio resolved')
    res.send(data)
    console.log('posting upload portfolio returned')
  }).catch(err => {
    console.log('posting upload portfolio did not resolve')
    console.log(err)
    res.send(err)
  })
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)