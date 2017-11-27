/**
 * Created by Rui on 9/11/17.
 */
const { DB } = require('./../utils')
const Router = require('restify-router').Router
const _ = require('lodash')
const rp = require('request-promise')

// import services
const { AnalyticsService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "analytics"

routerInstance.get('/', (req, res, next) => {
  // console.log('here')
  Promise.all([
    AnalyticsService.getAnalyticsTestClient(),
    AnalyticsService.getAnalyticsTestCpty()
  ]).then(data => {

    const [client, cpty] = data

    const newClientData =
    _.reduce(client.client, (sum, x) => {

      if(sum[`${x["n.id"]}`]){
        _.set(sum, `${x["n.id"]}.clientAllegation`, (parseFloat(sum[`${x["n.id"]}`].clientAllegation) + parseFloat(x["n1.marginAmount"])).toFixed(2))
        return sum
      }
      else {
        const obj = {}
        obj[`${x["n.id"]}`] = {
          "id": x["n.id"],
          "clientAllegation": parseFloat(x["n1.marginAmount"]),
          "disputed": 0,
          "disputeCode": []
        }
        return _.merge(sum, obj)
      }
    }, {})

    const newCptyData =
      _.reduce(cpty.cpty, (sum, x) => {

        if(sum[`${x["n.id"]}`]){
          _.set(sum, `${x["n.id"]}.counterpartyAllegation`, (parseFloat(sum[`${x["n.id"]}`].counterpartyAllegation) + parseFloat(x["n1.marginAmount"])).toFixed(2))
          return sum
        }
        else {
          const obj = {}
          obj[`${x["n.id"]}`] = {
            "id": x["n.id"],
            "counterpartyAllegation": parseFloat(x["n1.marginAmount"])
          }
          return _.merge(sum, obj)
        }
      }, {})

    res.send({"data": _.filter(_.merge(newClientData, newCptyData), x => _.has(x, 'clientAllegation') && _.has(x, 'counterpartyAllegation'))})

  })

})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
