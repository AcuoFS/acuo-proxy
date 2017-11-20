// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { CommonService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "common"

routerInstance.get('/proxy-connectivity', (req, res, next) => {
  res.send({status: "OK"})
})

routerInstance.get('/navbar-alerts', (req, res, next) => {
  CommonService.getNavbarAlerts().then(response => {
    console.log('response :')
    console.log(response)
    res.send(response)
    console.log('navbar alerts responded')
  })
})

routerInstance.get('/margin-connectivity', (req, res, next) => {
  CommonService.marginConnectivity().then(response => {
    // console.log('response :')
    // console.log(response)
    res.send(response)
    // console.log('margin connectivity responded')
  })
})

routerInstance.get('/valuation-connectivity', (req, res, next) => {
  CommonService.valuationConnectivity().then(response => {
    // console.log('response :')
    // console.log(response)
    res.send(response)
    // console.log('valuation connectivity responded')
  })
})

routerInstance.get('/collateral-connectivity', (req, res, next) => {
  CommonService.collateralConnectivity().then(response => {
    // console.log('response :')
    // console.log(response)
    res.send(response)
    // console.log('collateral connectivity responded')
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

routerInstance.post('/auth/login', (req, res, next) => {
  console.log('attempting login')
  // console.log(req.body)
  const { user, pass } = req.body
  CommonService.login(user, pass).then(response => {
    res.send({clientID: response})
  })
})

routerInstance.get('/get-currency', (req, res, next) => {
  CommonService.getCurrencyInfo().then(response => {
    console.log('response :')
    console.log(response)
    res.send(response)
    console.log('currency info responded')
  })
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
