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

routerInstance.get('/navbar-alerts', (req, res, next) => {
  CommonService.getNavbarAlerts().then(response => {
    res.send(response)
  })
})

routerInstance.get('/throw-404', (req, res, next) => {
 console.log('throwing 404');
  res.send(404)
})

routerInstance.get('/throw-500', (req, res, next) => {
  console.log('throwing 500');
  res.send(500)
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
