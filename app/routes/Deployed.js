/**
 * Created by Rui on 31/7/17.
 */

const Router = require('restify-router').Router
const _ = require('lodash')

// import services
const {
  DeployedService,
  CommonService,
  // CommonService
} = require('../services')

const {isString} = require('../utils')

// main object
const routerInstance = new Router()

// constants
const prefix = "deployed"

routerInstance.get('/departures/:clientId', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting deployed departures')
  console.log('clientId :', req.params.clientId)

  CommonService.authTokenValidation(req.headers.authorization).then(response => {
    if(response.statusCode === 401)
      res.send(401)

    DeployedService.getDepartures(req.params.clientId).then(data => {
        console.log('responding with: ----------')
        console.log(data.body)
        console.log('---------------------------')
        // res.header("authorization", response.headers.authorization)
        res.send(data.body)
        console.log('deployed departures responded')
      }
    )
  }).catch(err => res.send(401))

})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)


