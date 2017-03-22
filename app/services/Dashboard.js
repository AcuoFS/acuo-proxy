const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {GET_DASHBOARD_URL} = config


// import external library
const rp = require('request-promise')

// main object
const Dashboard = {}

// get Dashboard items
Dashboard.get = () => {
  const uri = GET_DASHBOARD_URL
  console.log('dashboard URL: ' + uri)
  return rp({uri, json: true})
}

module.exports = Dashboard
