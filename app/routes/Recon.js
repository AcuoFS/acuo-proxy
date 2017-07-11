// import libs
const Router = require('restify-router').Router
const _ = require('lodash')

// import services
const {
  ReconService,
  FsCacheService,
  CommonService
} = require('../services')

const {isString} = require('../utils')

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

const checkFirstLevelOnlyTolerance = (item, id, amount, toleranceLevel, GUID, who) => {
  let otherside = {amount: 0}

  if (who === 'COUNTERPARTY') {
    otherside = _.reduce(item.clientAssets, (sum, group) => {

      const firstLevelItem = _.reduce(group.data, (sum, firstLevel) => (
        firstLevel.__wrapped__.firstLevel.id === id ? sum = firstLevel.__wrapped__.firstLevel : sum
      ), {})

      // console.log(firstLevelItem)

      return (!_.isEmpty(firstLevelItem) ? sum = firstLevelItem : sum)
    }, {})

    // console.log('================ COUNTERPARTY ===============')
    // console.log(otherside)
  }

  if (who === 'CLIENT') {
    otherside = _.reduce(item.counterpartyAssets, (sum, group) => {

      const firstLevelItem = _.reduce(group.data, (sum, firstLevel) => (
        firstLevel.firstLevel.id === id ? sum = firstLevel.firstLevel : sum
      ), {})

      // console.log(firstLevelItem)

      return (!_.isEmpty(firstLevelItem) ? sum = firstLevelItem : sum)

    }, {})

    // console.log('================ CLIENT ===============')
    // console.log(otherside)
  }

  // if(GUID === 'msp37'){
  //   console.log('--------- ' + GUID + ' ---------')
  //   console.log('tolerance: ' + parseFloat(toleranceLevel))
  //   console.log('otherside amount: ' + Math.abs(parseFloat(otherside.amount)))
  //   console.log('this side amount: ' + Math.abs(parseFloat(amount)))
  //   console.log('-----------------------------')
  // }

  return (
    ((Math.abs(parseFloat(otherside.amount))) > (Math.abs(parseFloat(amount)) * (1 + parseFloat(toleranceLevel))))
    ||
    ((Math.abs(parseFloat(otherside.amount))) < (Math.abs(parseFloat(amount)) * (1 - parseFloat(toleranceLevel))))
  )
}

const checkTolerance = (item, parentID, id, amount, toleranceLevel, GUID, who) => {
  let otherside = {amount: 0}

  if (who === 'COUNTERPARTY') {
    otherside = _.reduce(item.clientAssets, (sum, group) => {
      const secondLevelItem = _.reduce(group.data, (sum, firstLevel) => {

        let secondLevelItem = 0

        if (_.get(_.get(firstLevel, '__wrapped__'), ['firstLevel', 'id'], 0) === parentID) {
          secondLevelItem = _.find(_.get(firstLevel, '__wrapped__').firstLevel.secondLevel, {id: id})
        }
        return (secondLevelItem ? sum = secondLevelItem : sum)
      }, {})

      return (!_.isEmpty(secondLevelItem) ? sum = secondLevelItem : sum)
    }, {})
  }

  if (who === 'CLIENT') {
    otherside = _.reduce(item.counterpartyAssets, (sum, group) => {

      const secondLevelItem = _.reduce(group.data, (sum, firstLevel) => {

        let secondLevelItem = 0
        //console.log(firstLevel)
        if (firstLevel.firstLevel.id === parentID)
          secondLevelItem = _.find(firstLevel.firstLevel.secondLevel, {id: id})

        return (secondLevelItem ? sum = secondLevelItem : sum)
      }, {})

      return (!_.isEmpty(secondLevelItem) ? sum = secondLevelItem : sum)
    }, {})
  }

  // if(GUID === 'msp42'){
  //   console.log('--------- ' + GUID + ' ---------')
  //   console.log('tolerance: ' + parseFloat(toleranceLevel))
  //   console.log('otherside amount: ' + Math.abs(parseFloat(otherside.amount)))
  //   console.log('this side amount: ' + Math.abs(parseFloat(amount)))
  //   console.log('-----------------------------')
  // }

  return (
    ((Math.abs(parseFloat(otherside.amount))) > (Math.abs(parseFloat(amount)) * (1 + parseFloat(toleranceLevel))))
    ||
    ((Math.abs(parseFloat(otherside.amount))) < (Math.abs(parseFloat(amount)) * (1 - parseFloat(toleranceLevel))))
  )

}

/*********
* DEPRECATED ROUTE
* */
routerInstance.get('/', (req, res, next) => {
  const key = req.path()

  ReconService.get().then(data => {

    const newData = _.map(data, (item) =>
      _.chain(item)
        .set('clientAssets', _.map(_.filter(item.clientAssets, (group) => group.data.length), (group) =>
          _.set(group, 'data', _.map(group.data, (firstLevel) =>
            _.chain(firstLevel)
              .set(['firstLevel', 'secondLevel'], _.map(firstLevel.firstLevel.secondLevel, (secondLevel) =>
                _.chain(secondLevel)
                  .set('parentIndex', firstLevel.firstLevel.id)
                  .set('tolerance', checkTolerance(item, firstLevel.firstLevel.id, secondLevel.id, secondLevel.amount, item.tolerance, item.GUID, 'CLIENT'))))
              .set(['firstLevel', 'secondLevelCount'], firstLevel.firstLevel.secondLevel.length)
              .set(['firstLevel', 'GUID'], item.GUID)
              .set(['firstLevel', 'tolerance'], (!firstLevel.firstLevel.secondLevel.length ? checkFirstLevelOnlyTolerance(item, firstLevel.firstLevel.id, firstLevel.firstLevel.amount, item.tolerance, item.GUID, 'CLIENT') : false))

          ))))
        .set('counterpartyAssets', _.map(_.filter(item.counterpartyAssets, (group) => group.data.length), (group) =>
          _.set(group, 'data', _.map(group.data, (firstLevel) =>
            _.chain(firstLevel)
              .set(['firstLevel', 'secondLevel'], _.map(firstLevel.firstLevel.secondLevel, (secondLevel) =>
                _.chain(secondLevel)
                  .set('parentIndex', firstLevel.firstLevel.id)
                  .set('tolerance', checkTolerance(item, firstLevel.firstLevel.id, secondLevel.id, secondLevel.amount, item.tolerance, item.GUID, 'COUNTERPARTY'))))
              .set(['firstLevel', 'secondLevelCount'], firstLevel.firstLevel.secondLevel.length)
              .set(['firstLevel', 'GUID'], item.GUID)
              .set(['firstLevel', 'tolerance'], (!firstLevel.firstLevel.secondLevel.length ? checkFirstLevelOnlyTolerance(item, firstLevel.firstLevel.id, firstLevel.firstLevel.amount, item.tolerance, item.GUID, 'COUNTERPARTY') : false))

          )))))

    // FsCacheService.set({key, newData})
    res.json({items: newData})
  }).catch(err => {
    // hit cache
    // FsCacheService.get(key)
    //   .then(items => res.json(_.set({items}, 'fromCache', true)))
    //   .catch((error) => console.log('Error getting from cache: ' + error))
  })
})

/**********
 * DEPRECATED ROUTE END
 * */

routerInstance.get('/new', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting recon data')
  const key = req.path()

  Promise.all([
    ReconService.get(),
    ReconService.getReconDisputes(),
    CommonService.getCurrencyInfo()
  ]).then(data => {
    console.log('recon URLs resolved')
    console.log(data)
    const [recon, disputes, currencyInfo] = data

    const newData = _.map(recon, (item) =>
      _.chain(item)
        .set('clientAssets', _.map(_.filter(item.clientAssets, (group) => group.data.length), (group) =>
          _.set(group, 'data', _.map(group.data, (firstLevel) =>
            _.chain(firstLevel)
              .set(['firstLevel', 'secondLevel'], _.map(firstLevel.firstLevel.secondLevel, (secondLevel) =>
                _.chain(secondLevel)
                  .set('parentIndex', firstLevel.firstLevel.id)
                  .set('tolerance', checkTolerance(item, firstLevel.firstLevel.id, secondLevel.id, secondLevel.amount, item.tolerance, item.GUID, 'CLIENT'))))
              .set(['firstLevel', 'secondLevelCount'], firstLevel.firstLevel.secondLevel.length)
              .set(['firstLevel', 'GUID'], item.GUID)
              .set(['firstLevel', 'tolerance'], (!firstLevel.firstLevel.secondLevel.length ? checkFirstLevelOnlyTolerance(item, firstLevel.firstLevel.id, firstLevel.firstLevel.amount, item.tolerance, item.GUID, 'CLIENT') : false))
          ))))
        .set('counterpartyAssets', _.map(_.filter(item.counterpartyAssets, (group) => group.data.length), (group) =>
          _.set(group, 'data', _.map(group.data, (firstLevel) =>
            _.chain(firstLevel)
              .set(['firstLevel', 'secondLevel'], _.map(firstLevel.firstLevel.secondLevel, (secondLevel) =>
                _.chain(secondLevel)
                  .set('parentIndex', firstLevel.firstLevel.id)
                  .set('tolerance', checkTolerance(item, firstLevel.firstLevel.id, secondLevel.id, secondLevel.amount, item.tolerance, item.GUID, 'COUNTERPARTY'))))
              .set(['firstLevel', 'secondLevelCount'], firstLevel.firstLevel.secondLevel.length)
              .set(['firstLevel', 'GUID'], item.GUID)
              .set(['firstLevel', 'tolerance'], (!firstLevel.firstLevel.secondLevel.length ? checkFirstLevelOnlyTolerance(item, firstLevel.firstLevel.id, firstLevel.firstLevel.amount, item.tolerance, item.GUID, 'COUNTERPARTY') : false))
          ))))
        // Add disputes info
        .set('disputeInfo', (_.filter(disputes, disputeItem => (item.GUID === disputeItem.msId))[0] || {}))
    )

    const compositeData = {items: newData, currencyInfo: currencyInfo}

    //FsCacheService.set({key, compositeData})
    console.log('responding with: ----------')
    console.log(compositeData)
    console.log('---------------------------')
    res.json(compositeData)
    console.log('recon responded')
  }).catch(err => {
    console.log('recon URL did not resolve')
    console.log(err)
    // hit cache
    //FsCacheService.get(key)
    //  .then(items => res.json(_.set({items}, 'fromCache', true)))
    //  .catch((error) => console.log('Error getting from cache: ' + error))
  })

})


routerInstance.get('/disputes', (req, res, next) => {
  console.log('**** ========= ****')
  console.log('requesting recon disputes')
  const key = req.path()

  ReconService.getReconDisputes().then(data => {
    //FsCacheService.set({key, data})
    console.log('recon disputes URL resolved')
    console.log('responding with: ----------')
    console.log({items: data})
    console.log('---------------------------')
    res.json({items: data})
    console.log('recon disputes responded')
  }).catch(err => {
    // hit cache
    // FsCacheService.get(key)
    //   .then(items => res.json(_.set({items}, 'fromCache', true)))
    //   .catch((error) => console.log('Error getting from cache: ' + error))
    console.log('recon disputes URL did not resolve')
    console.log(err)
  })
})

routerInstance.post('/disputeStatement', (req, res, next) => {
  // forwards response from endpoint
  console.log('**** ========= ****')
  console.log('posting dispute')
  let objToSend = req.body
  if (isString(objToSend)) {
    // parse as a js obj
    objToSend = JSON.parse(req.body)
  }
  console.log('objToSend: ' + objToSend)

  ReconService.postReconDispute(objToSend).then(data => {
    console.log('posting dispute resolved')
    console.log('responding with: ----------')
    console.log(data)
    console.log('---------------------------')
    res.send(data)
    console.log('posting dispute responded')
  }).catch(err => {
    console.log('posting dispute URL did not resolve')
    console.log(err)
    res.send(err)
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
