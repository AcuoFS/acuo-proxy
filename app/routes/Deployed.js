/**
 * Created by Rui on 31/7/17.
 */

const Router = require('restify-router').Router
const _ = require('lodash')

// import services
const {
  DeployedService,
  FsCacheService,
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

  DeployedService.getDepartures(req.params.clientId).then(data => {
      console.log('responding with: ----------')
      console.log(data)
      console.log('---------------------------')
      res.header("authorization", response.headers.authorization)
      res.send(data)
      console.log('deployed departures responded')
    }
  )
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)


