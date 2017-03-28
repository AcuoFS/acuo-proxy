// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { PledgeService, FsCacheService } = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "pledge"

// ======================================================================
routerInstance.get('/optimization', (req, res, next) => {
  // get data
  const key = req.path()

  PledgeService.get().then(items => {
    // hit backend
    FsCacheService.set({key, data:items})
    res.json({items})

  }).catch(err => {
    // backend is down, get from cache
    FsCacheService.get(key).then(items => res.json({items, fromCache: true}))
  })
})

routerInstance.post('/allocate-selection', (req, res, next) => {
  const key = req.path()
  const { guids, optimisationSetting } = JSON.parse(req.body)

  Promise.all([
    PledgeService.calculateCase(optimisationSetting),
    PledgeService.getInitSelection(),
    PledgeService.getAllocatedAssets()
  ]).then(data => {
    // hit backend
    const [caseCode, items, {items: assets}] = data

    const processedItems = items.map(item => (guids.includes(item.GUID)
      // if item is in request list, then allocate assets to it
      ? PledgeService.allocateAssets(item, caseCode, assets)
      // if item is not in request list, just return it
      : item
    ))

    // FsCacheService.set({key, data})
    res.send({items: processedItems})

  }).catch(err => {
    // hit cache
    // FsCacheService.get(key).then(items => res.send({items, fromCache: true}))
    console.log(err)
  })
})


routerInstance.post('/allocate-selection-new', (req, res, next) => {
  const key = req.path()
  const {optimisationSettings, toBeAllocated} = JSON.parse(req.body)

  Promise.all([
    PledgeService.getInitSelection(),
    PledgeService.postSelection({optimisationSettings, toBeAllocated})
  ]).then(data => {
    const [selectionItems, {allocated}] = data
    //console.log('allocated' + JSON.stringify(allocated))
    //console.log(JSON.stringify(_.map(selectionItems, (item) => _.set(item, 'clientAssets', _.filter(item.clientAssets, (group) => group.data.length)))))
    const processedItems = _.map(selectionItems, (item) => _.set(item, 'clientAssets', _.filter(item.clientAssets, (group) => group.data.length))).map(selectionItem => {
        _.forOwn(allocated, (allocatedInfo, allocatedGUID) => {
          if (selectionItem.GUID == allocatedGUID) {
            console.log(allocatedInfo)
            return _.merge(selectionItem, {
              allocated: allocatedInfo
            })
          }
        })
        return selectionItem
      }
    )
    res.send({items: processedItems})
  }).catch(err => {
    console.log(err)
  })
})

routerInstance.post('/pledge-allocation', (req, res, next) => {
  const pledgeReq = JSON.parse(req.body)

  // forwards reponse from endpoint
  res.send(PledgeService.postPledgeAllocation(pledgeReq))
})

// routerInstance.post('/allocate-selection', (req, res, next) => {
//   const key = req.path()
//
//   Promise.all([PledgeService.asset(), PledgeService.earmarked()]).then(data => {
//     // hit backend
//     const [detailedAssets, {earmarked}] = data
//     const assets = _(detailedAssets).values()
//       .reduce((all, one) => {
//         return _.concat(all, one)
//       }, [])
//       .map(asset => {
//         const filter = _.pick(asset, ['assetId', 'assetIdType'])
//         const result = _.find(earmarked, filter)
//
//         return result
//           ? _.set(asset, 'earmarked', true)
//           : asset
//       })
//
//     FsCacheService.set({key, data: assets})
//     res.send({items: assets})
//
//   }).catch(err => {
//     // hit cache
//     FsCacheService.get(key).then(items => res.send({items, fromCache: true}))
//   })
// })

routerInstance.get('/init-selection', (req, res, next) => {
  const key = req.path()

  PledgeService.getInitSelection().then(data => {

    const newData = _.map(data, (item) =>
      _.chain(item)
        .set('clientAssets', _.map(_.filter(item.clientAssets, (group) => group.data.length))))

    // hit back
    FsCacheService.set({key, newData})
    res.send({items:newData})

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(items => res.json({items, fromCache: true}))
  })
})

routerInstance.get('/init-collateral', (req, res, next) => {
  PledgeService.getInitCollateral().then(data => res.send(data))
})

routerInstance.get('/init-new-collateral', (req, res, next) => {
  const key = req.path()

  Promise.all([PledgeService.asset(), PledgeService.earmarked()]).then(data => {
    // hit backend
    const [detailedAssets, {earmarked}] = data

    const listOfAllAssets = _(detailedAssets).values().reduce((all, one) => {
        return _.concat(all, one)
      }, []).map(asset => {
        const filter = _.pick(asset, ['assetId', 'assetIdType'])
        const result = _.find(earmarked, filter)

        return result
          ? _.set(asset, 'earmarked', true)
          : asset
      })

    const assets = _(_.uniq(_.map(listOfAllAssets, 'assetCategory'))).reduce((obj, category) => {
      return _.set(obj, [category], _(listOfAllAssets).filter(asset => (asset.assetCategory == category && !asset.earmarked)))
    }, _.set({}, 'earmarked', _(listOfAllAssets).filter(asset => asset.earmarked)))

    //const assets = _.set(list, 'earmarked', _(listOfAllAssets).filter(asset => asset.earmarked))

    FsCacheService.set({key, data: assets})

    res.send({items: assets})

  }).catch(err => {
    // hit cache
    FsCacheService.get(key).then(items => res.send({items, fromCache: true}))
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
