const {GET_DASHBOARD_URL} = require('../constants/endpoints-dev')

// import external library
const rp = require('request-promise')

// main object
const Dashboard = {}

// get Dashboard items
Dashboard.get = () => {
  const uri = GET_DASHBOARD_URL
  return rp({uri, json: true})
}

module.exports = Dashboard
