/**
 * Created by Rui on 13/11/17.
 */
const config = require('../constants/config').get(process.env.DOCKER_ENV)

const {
  GET_ANALYTICS_TEST_CLIENT,
  GET_ANALYTICS_TEST_CPTY
} = config

const rp = require('request-promise')

const Analytics = {}

Analytics.getAnalyticsTestClient = () => {
  const uri = GET_ANALYTICS_TEST_CLIENT
  return rp({uri, json: true}).then(response => {
    console.log('GET_ANALYTICS_TEST_CLIENT returned')
    return response
  })
}

Analytics.getAnalyticsTestCpty = () => {
  const uri = GET_ANALYTICS_TEST_CPTY
  return rp({uri, json: true}).then(response => {
    console.log('GET_ANALYTICS_TEST_CPTY returned')
    return response
  })
}

module.exports = Analytics