// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
const rp = require('request-promise')
const fs = require('fs')

// import services
const {CommonService} = require('../services')

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
  const {user, pass} = req.body
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

// -X POST
// -H "sessionToken: SESSION_TOKEN"
// -H "Content-Type: application/json"
// -d '{
// "streamTypes": [
//   {"type": "IM"},
//   {"type": "MIM"},
//   {"type": "ROOM"},
//   {"type": "POST"}
// ],
//   "includeInactiveStreams": true
// }'
// "https://acme.symphony.com/pod/v1/streams/list"

//.symphony.com/sessionauth/v1/app/user/347583113330922/authenticate

// https://YOUR_POD_SUBDOMAIN-api.symphony.com/sessionauth/v1/app/authenticate

routerInstance.get('/streamtest', (req, res, next) => {
  const uri = 'https://develop-api.symphony.com:8444/sessionauth/v1/app/authenticate'
  console.log(__dirname)
  return rp({
    uri,
    method: 'POST',
    headers: {'cache-control': 'no-cache'},
    agentOptions: {
      pfx: fs.readFileSync(__dirname + '/../certs/acuo-cert.p12'),
      passphrase: 'acuo123$'
    }
  }).then(response => {
    // console.log(response)
    const token = JSON.parse(response).token
    console.log(token)
    setTimeout(() => {
        rp({
          uri: 'https://develop-api.symphony.com:8444/sessionauth/v1/app/user/347583113330922/authenticate',
          method: 'POST',
          headers: {
            'cache-control': 'no-cache',
            'sessionToken': token,
            'Content-Type': 'application/json'
          },
          agentOptions: {
            pfx: fs.readFileSync(__dirname + '/../certs/acuo-cert.p12'),
            passphrase: 'acuo123$'
          }
        }).then(response => {
          // console.log(response)
          console.log(response)
          res.send(JSON.parse(response))
        })
      }, 2000)
  })
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)