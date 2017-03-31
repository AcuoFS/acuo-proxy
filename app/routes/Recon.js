// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const {ReconService, FsCacheService} = require('../services')

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

const checkTolerance = (item, parentID, id, amount, toleranceLevel, GUID, who) => {
  let otherside = {amount: 0}

  if (who == 'COUNTERPARTY') {
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

  if (who == 'CLIENT') {
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

  if (
    ((Math.abs(parseFloat(otherside.amount))) > (Math.abs(parseFloat(amount)) * (1 + parseFloat(toleranceLevel))))
    ||
    ((Math.abs(parseFloat(otherside.amount))) < (Math.abs(parseFloat(amount)) * (1 - parseFloat(toleranceLevel))))
  ) {
    return true
  }
  else {
    return false
  }

}

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
          )))))

    FsCacheService.set({key, newData})
    res.json({items: newData})
  }).catch(err => {
    // hit cache
    FsCacheService.get(key)
      .then(items => res.json(_.set({items}, 'fromCache', true)))
      .catch((error) => console.log('Error getting from cache: ' + error))
  })
})

routerInstance.get('/new', (req, res, next) => {
  const key = req.path()

  Promise.all([
    ReconService.get(),
    ReconService.getReconDisputes()
  ]).then(data => {

    const [recon, disputes] = data

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
          ))))
        // Add disputes info
        .set('disputeInfo', (_.filter(disputes, disputeItem => (item.GUID === disputeItem.msId))[0] || {}))
    )

    FsCacheService.set({key, newData})
    res.json({items: newData})
  }).catch(err => {
    // hit cache
    FsCacheService.get(key)
      .then(items => res.json(_.set({items}, 'fromCache', true)))
      .catch((error) => console.log('Error getting from cache: ' + error))
  })

})


routerInstance.get('/disputes', (req, res, next) => {
  const key = req.path()

  ReconService.getReconDisputes().then(data => {
    FsCacheService.set({key, data})
    res.json({items: data})
  }).catch(err => {
    // hit cache
    FsCacheService.get(key)
      .then(items => res.json(_.set({items}, 'fromCache', true)))
      .catch((error) => console.log('Error getting from cache: ' + error))
  })
})

routerInstance.post('/disputeStatement', (req, res, next) => {
  // forwards response from endpoint
  ReconService.postReconDispute(req.body).then(data => {
    res.send(data)
  }).catch(err => {
    res.send(err)
  })
})


module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)
