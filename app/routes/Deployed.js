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

routerInstance.get('/departures', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting deployed departures')
  DeployedService.getDepartures().then(data => {
      console.log('responding with: ----------')
      console.log(data)
      console.log('---------------------------')
      res.send(data)
      console.log('deployed departures responded')
    }
  )
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)


