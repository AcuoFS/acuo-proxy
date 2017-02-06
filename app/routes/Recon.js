// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { ReconService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "recon"

// ======================================================================
// routerInstance.get('/', (req, res, next) => {
//   const key = req.path()
//
//   ReconService.get().then(data => {
//     // hit backend
//     FsCacheService.set({key, data})
//     res.json({items:data})
//
//   }).catch(err => {
//     // hit cache
//     FsCacheService.get(key).then(items => res.json(_.set({items}, 'fromCache', true)))
//   })
// })

routerInstance.get('/', (req, res, next) => {
  const key = req.path()

  ReconService.get().then(data => {
    const newData = _.map(_.map(data.items, (item) =>
      _.set(item, 'clientAssets', _.map(item.clientAssets, (group) =>
        _.set(group, 'data', _.map(group.data, (firstLevel) =>
          _.set(firstLevel, 'secondLevel', _.map(firstLevel.firstLevel.secondLevel, (secondLevel) =>
            _.set(secondLevel, 'parentIndex', firstLevel.firstLevel.id)))))))), (item) =>
      _.set(item, 'counterpartyAssets', _.map(item.counterpartyAssets, (group) =>
        _.set(group, 'data', _.map(group.data, (firstLevel) =>
          _.set(firstLevel, 'secondLevel', _.map(firstLevel.firstLevel.secondLevel, (secondLevel) =>
            _.set(secondLevel, 'parentIndex', firstLevel.firstLevel.id))))))))

    FsCacheService.set({key, newData})
    res.json({items:newData})
  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(items => res.json(_.set({items}, 'fromCache', true)))
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
