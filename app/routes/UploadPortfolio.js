// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UnmatchedPortfolioService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "upload"

routerInstance.post('/', (req, res, next) => {
  console.log('here')
  let objToSend = req.body
  console.log(objToSend)
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)