// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { DashboardService, CommonService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "dashboard"

// ======================================================================
routerInstance.get('/:clientId', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting dashboard')
  const key = req.path()
  console.log('clientId :', req.params.clientId)

  CommonService.authTokenValidation(req.headers.authorization).then(response =>

    DashboardService.get(req.params.clientId).then(data => {
      // hit backend
      console.log('dashboard URL resolved')
      let { derivatives } = data.body

      derivatives = _.map(derivatives, (derivative => {
        return _.set(derivative, 'marginStatus', _.filter(derivative.marginStatus, (margin => {
          const excludedStatus = ['matchedtoreceived', 'waitdispute', 'partialdispute']
          return !excludedStatus.includes(margin.status)
        })))
      }))

      derivatives = JSON.parse(JSON.stringify(derivatives).replace(/(ActionDispute|actiondispute)/g, "dispute"))

      //FsCacheService.set({key, data: derivatives})
      console.log('responding with: ----------')
      console.log({derivatives})
      console.log('---------------------------')
      // res.header("authorization", response.headers.authorization)
      res.send({derivatives})
      console.log('dashboard responded')

    }).catch(err => {
      // hit cache
      //FsCacheService.get(key).then(data => res.json({derivatives: data, fromCache: true}))
      console.log('dashboard URL did not resolve')
      console.log(err)
    })

  ).catch(err => res.send(401))
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
