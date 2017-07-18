const config = require('../constants/config').get(process.env.DOCKER_ENV)

const {
  GET_CURRENCY_INFO_URL
} = config

const rp = require('request-promise')

const Common = {}

Common.getCurrencyInfo = () => {
  const uri = GET_CURRENCY_INFO_URL
  return rp({uri, json: true}).then(response => console.log('currency info returned'))
}

module.exports = Common