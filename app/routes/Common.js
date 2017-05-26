// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { CommonService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "common"

routerInstance.get('/check-connectivity', (req, res, next) => {
  res.send({status: "OK"})
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)