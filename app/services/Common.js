const config = require('../constants/config').get(process.env.DOCKER_ENV)

const {
  GET_CURRENCY_INFO_URL,
  GET_NAVBAR_ALERTS
} = config

const rp = require('request-promise')

const Common = {}

Common.getCurrencyInfo = () => {
  const uri = GET_CURRENCY_INFO_URL
  return rp({uri, json: true}).then(response => {
    console.log('currency info returned')
    return response
  })
}

Common.getNavbarAlerts = () => {
  const uri = GET_NAVBAR_ALERTS
  return rp({uri, json: true}).then(response => {
    console.log('navbar alerts returned')
    return response
  })
}

module.exports = Common