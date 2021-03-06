const config = require('../constants/config').get(process.env.DOCKER_ENV)

const {
  GET_CURRENCY_INFO_URL,
  GET_NAVBAR_ALERTS,
  MARGIN_HEALTH_CHECK,
  VALUATION_HEALTH_CHECK,
  COLLATERAL_HEALTH_CHECK,
  LOGIN_URL,
  GET_VALIDATE_AUTH_TOKEN,
  GET_INVALIDATE_AUTH_TOKEN,
  GET_REFRESH_AUTH_TOKEN
} = config

const rp = require('request-promise')

const Common = {}

Common.getCurrencyInfo = (clientId) => {
  const uri = `${GET_CURRENCY_INFO_URL}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true}).then(response => {
    console.log('currency info returned')
    return response
  })
}

Common.getNavbarAlerts = (clientId) => {
  const uri = `${GET_NAVBAR_ALERTS}/${clientId}`
  return rp({uri, json: true, resolveWithFullResponse: true}).then(response => {
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
    // console.log(response.headers)
    console.log('login return response')
    return response
  }).catch(err => err)

Common.authTokenValidation = (token) =>
  rp({
    method: 'GET',
    uri: GET_VALIDATE_AUTH_TOKEN,
    auth: {
      'bearer': removeBearer(token)
    },
    json: true,
    resolveWithFullResponse: true
  }).then(response => {
    console.log('===== VALID ACCESS TOKEN =====')
    return response
  }).catch(err => {
    // console.log(err)
    err.statusCode = 498
    return err
  })


Common.authInvalidateToken = (token) =>
  rp({
    method: 'GET',
    uri: GET_INVALIDATE_AUTH_TOKEN,
    auth: {
      'bearer': removeBearer(token)
    },
    json: true,
    resolveWithFullResponse: true
  }).then(response => {
    console.log(response)
    return response
  }).catch(err => {
    console.log(err)
    return err
  })

Common.refreshAuthToken = (cookie) => {
  console.log('IN SERVICE')
  console.log(cookie)
  return rp({
    method: 'GET',
    uri: GET_REFRESH_AUTH_TOKEN,
    headers: {
      cookie
    },
    json: true,
    resolveWithFullResponse: true
  }).then(response => {
    // console.log(response)
    return response
  }).catch(err => {
    console.log(err)
    return err
  })
}



const removeBearer = (token) =>
  token.split('Bearer ')[1]



module.exports = Common