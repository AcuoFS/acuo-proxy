const config = require('../constants/config').get(process.env.DOCKER_ENV)

const {
  GET_CURRENCY_INFO_URL,
  GET_NAVBAR_ALERTS,
  MARGIN_HEALTH_CHECK,
  VALUATION_HEALTH_CHECK,
  COLLATERAL_HEALTH_CHECK,
  LOGIN_URL
} = config

const rp = require('request-promise')

const Common = {}

Common.getCurrencyInfo = (clientId) => {
  const uri = `${GET_CURRENCY_INFO_URL}/${clientId}`
  return rp({uri, json: true}).then(response => {
    console.log('currency info returned')
    return response
  })
}

Common.getNavbarAlerts = (clientId) => {
  const uri = `${GET_NAVBAR_ALERTS}/${clientId}`
  return rp({uri, json: true}).then(response => {
    console.log('navbar alerts returned')
    return response
  })
}

Common.marginConnectivity = () => {
  return rp({uri: MARGIN_HEALTH_CHECK, json: true}).then(response => {
    console.log('margin health check returned')
    return response
  })
}

Common.valuationConnectivity = () => {
  return rp({uri: VALUATION_HEALTH_CHECK, json: true}).then(response => {
    console.log('valuation health check returned')
    return response
  })
}

Common.collateralConnectivity = () => {
  return rp({uri: COLLATERAL_HEALTH_CHECK, json: true}).then(response => {
    console.log('collateral health check returned')
    return response
  })
}

Common.login = (user, pass) =>
  rp({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    uri: LOGIN_URL,
    body: {
      "userName" : user,
      "password" : pass
    },
    json: true,
    resolveWithFullResponse: true
  }).then(response => {
    console.log(response)
    console.log('login return response')
    return response
  })



module.exports = Common