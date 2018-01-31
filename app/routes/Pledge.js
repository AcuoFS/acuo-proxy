// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const {PledgeService, FsCacheService} = require('../services')

// main object
const routerInstance = new Router()

// constants
const prefix = "pledge"

/** TODO: AUTH HEADER
 **/
routerInstance.post('/remove-allocated-asset', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('removing allocated asset')
  // console.log('clientId :', req.params.clientId)

  const key = req.path()
  const json = req.body
  const { clientId } = JSON.parse(json)
  console.log('clientId :', clientId)

  Promise.all([
    PledgeService.getInitSelection(clientId),
    PledgeService.postRemoveAllocated(json)
  ]).then(data => {
    // hit backend
    console.log('removing allocated asset all URLs resolved')
    const [selectionItems, allocatedRes] = data
    const { allocated } = allocatedRes.body

    const processedItems = _.map(selectionItems.body, (item) => _.set(item, 'clientAssets', _.filter(item.clientAssets, (group) => group.data.length))).map(selectionItem => {
        _.forOwn(allocated, (allocatedInfo, allocatedGUID) => {
          if (selectionItem.GUID == allocatedGUID) {
            //console.log(allocatedInfo)
            return _.merge(selectionItem, {
              allocated: allocatedInfo[0]
            })
          }
        })
        return selectionItem
      }
    )
    console.log('responding with: ----------')
    console.log({items: processedItems})
    console.log('---------------------------')
    console.log(data)
    res.send({items: processedItems})
    console.log('removing allocated asset responded')
  }).catch(err => {
    // hit cache
    // FsCacheService.get(key).then(items => res.send({items, fromCache: true}))
    console.log('removing allocated URL did not resolve')
    console.log(err)
  })
})
// ======================================================================
routerInstance.get('/optimization/:clientId', (req, res, next) => {
  // get data
  console.log('**** ========= ****')
  console.log('request optimization')
  const key = req.path()
  console.log('clientId :', req.params.clientId)

  PledgeService.getOptimisation(req.params.clientId).then(items => {
    // hit backend
    console.log('optimization resolved')
    //FsCacheService.set({key, data: items})
    // res.header("authorization", items.headers.authorization)
    res.json({items: items.body})
    console.log('optimization returned')

  }).catch(err => {
    // backend is down, get from cache
    //FsCacheService.get(key).then(items => res.json({items, fromCache: true}))
    console.log('optimization URL did not resolve')
    console.log(err)
  })
})

routerInstance.post('/allocate-selection', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('posting allocate of selection')
  const key = req.path()
  const {guids, optimisationSetting, clientId} = JSON.parse(req.body)

  Promise.all([
    PledgeService.calculateCase(optimisationSetting),
    PledgeService.getInitSelection(clientId),
    PledgeService.getAllocatedAssets(clientId)
  ]).then(data => {
    // hit backend
    console.log('allocation URLs resolved')
    console.log(data)
    const [caseCode, items, assetsRes] = data
    const {items: assets} = assetsRes.body

    const processedItems = items.body.map(item => (guids.includes(item.GUID)
        // if item is in request list, then allocate assets to it
        ? PledgeService.allocateAssets(item, caseCode.body, assets)
        // if item is not in request list, just return it
        : item
    ))

    // FsCacheService.set({key, data})
    res.send({items: processedItems})
    console.log('allocation returned')

  }).catch(err => {
    // hit cache
    // FsCacheService.get(key).then(items => res.send({items, fromCache: true}))
    console.log('allocation URL did not resolve')
    console.log(err)
  })
})


routerInstance.post('/allocate-selection-new', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('posting allocate selection new')
  const key = req.path()
  const {optimisationSettings, toBeAllocated, clientId} = req.body

  Promise.all([
    PledgeService.getInitSelection(clientId),
    PledgeService.postSelection({optimisationSettings, toBeAllocated, clientId})
  ]).then(data => {
    console.log('allocate selection new URLs resolved')
    console.log(data)
    const [selectionItems, allocatedRes] = data
    const { allocated } = allocatedRes.body

    console.log(allocated)
    // console.log('data: ' + JSON.stringify(data))
    // console.log('allocated: ' + JSON.stringify(allocated))
    //console.log(JSON.stringify(_.map(selectionItems, (item) => _.set(item, 'clientAssets', _.filter(item.clientAssets, (group) => group.data.length)))))
    const processedItems = _.map(selectionItems.body, (item) => _.set(item, 'clientAssets', _.filter(item.clientAssets, (group) => group.data.length))).map(selectionItem => {
        _.forOwn(allocated, (allocatedInfo, allocatedGUID) => {
          if (selectionItem.GUID == allocatedGUID) {
            //console.log(allocatedInfo)
            return _.merge(selectionItem, {
              allocated: allocatedInfo[0]
            })
          }
        })
        return selectionItem
      }
    )
    console.log('responding with: ----------')
    console.log({items: processedItems})
    console.log('---------------------------')
    // res.header("authorization", data.headers.authorization)
    res.send({items: processedItems})
    console.log('allocate selection new responded')
  }).catch(err => {
    console.log('allocate selection URL did not resolve')
    console.log(err)
  })
})

routerInstance.post('/pledge-allocation', (req, res, next) => {
  console.log('posting pledge')
  const pledgeReq = req.body

  // forwards reponse from endpoint
  PledgeService.postPledgeAllocation(pledgeReq).then(response => {
    // res.header("authorization", response.headers.authorization)
    res.send(response.body)
  })
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

routerInstance.get('/init-selection/:clientId', (req, res, next) => {
  console.log('requesting selection')
  const key = req.path()

  PledgeService.getInitSelection(req.params.clientId).then(data => {
    console.log('**** ========= ****')
    console.log('selection URL resolved')
    const newData = _.map(data.body, (item) =>
      _.chain(item)
        .set('clientAssets', _.map(_.filter(item.clientAssets, (group) => group.data.length))))

    // hit back
    //FsCacheService.set({key, newData})
    console.log('responding with: ----------')
    console.log({items: newData})
    console.log('---------------------------')
    // res.header("authorization", data.headers.authorization)
    res.send({items: newData})
    console.log('selection responded')
  }).catch(err => {
    // hit cache
    //FsCacheService.get(key).then(items => res.json({items, fromCache: true}))
    console.log('selection URL did not resolve')
    console.log(err)
  })
})

routerInstance.get('/init-collateral/:clientId', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting collateral')
  PledgeService.getInitCollateral(req.params.clientId).then(data => {
      console.log('responding with: ----------')
      console.log(data.body)
      console.log('---------------------------')
      // res.header("authorization", data.headers.authorization)
      res.send(data.body)
      console.log('collateral responded')
    }
  )

})

routerInstance.get('/init-new-collateral/:clientId', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting new collateral')
  const key = req.path()
  Promise.all([
    PledgeService.asset(req.params.clientId),
    PledgeService.earmarked(req.params.clientId)
  ]).then(data => {
    // hit backend
    console.log('new collateral URLs resolved')
    const [detailedAssets, earmarkedRes] = data
    const { earmarked } = earmarkedRes.body

    const listOfAllAssets = _(detailedAssets.body).values().reduce((all, one) => {
      return _.concat(all, one)
    }, []).map(asset => {
      const filter = _.pick(asset, ['assetId', 'assetIdType'])
      const result = _.find(earmarked, filter)

      return result
        ? _.set(asset, 'earmarked', true)
        : asset
    })

    const assets = _(_.uniq(_.map(listOfAllAssets, 'assetCategory'))).reduce((obj, category) => {
      return _.set(obj, [category], _(listOfAllAssets).filter(asset => (asset.assetCategory == category)))
    }, _.set({}, 'earmarked', _(listOfAllAssets).filter(asset => asset.earmarked)))

    //const assets = _.set(list, 'earmarked', _(listOfAllAssets).filter(asset => asset.earmarked))

    //FsCacheService.set({key, data: assets})
    console.log('responding with: ----------')
    console.log({items: assets})
    console.log('---------------------------')
    // res.header("authorization", data.headers.authorization)
    res.send({items: assets})
    console.log('new collateral returned')
  }).catch(err => {
    // hit cache
    //FsCacheService.get(key).then(items => res.send({items, fromCache: true}))
    console.log('new collateral URL did not resolve')
    console.log(err)
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
