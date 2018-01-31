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

routerInstance.get('/navbar-alerts/:clientId', (req, res, next) => {
  console.log('******** Navbar alerts ********')
  console.log('clientId :', req.params.clientId)

  // console.log(req.headers.authorization)

  // console.log('/******* AUTH *******/')
  CommonService.authTokenValidation(req.headers.authorization).then(response =>
  // console.log('/******* AUTH END *******/')
    CommonService.getNavbarAlerts(req.params.clientId).then(response => {
      console.log('response :')
      console.log(response)
      // res.header("authorization", response.headers.authorization)
      res.send(response.body)
      console.log('navbar alerts responded')
    })
  ).catch(err => res.send(401))
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

  if(req.headers.authorization)
    CommonService.authInvalidateToken(req.headers.authorization).then(response =>
      CommonService.login(user, pass).then(response => {
        // console.log(response)
        res.header("authorization", response.headers.authorization)
        res.send({clientId: response.body})
      })
    )
  else
    CommonService.login(user, pass).then(response => {
      // console.log(response)
      res.header("authorization", response.headers.authorization)
      res.send({clientId: response.body})
    })
})

routerInstance.get('/get-currency/:clientId', (req, res, next) => {
  CommonService.authTokenValidation(req.headers.authorization).then(response =>
    CommonService.getCurrencyInfo(req.params.clientId).then(response => {
      console.log('response :')
      console.log(response)
      // res.header("authorization", response.headers.authorization)
      res.send(response.body)
      console.log('currency info responded')
    })
  ).catch(err => res.send(401))
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
