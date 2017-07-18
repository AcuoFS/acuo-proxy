const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {GET_DASHBOARD_URL} = config


// import external library
const rp = require('request-promise')

// main object
const Dashboard = {}

// get Dashboard items
Dashboard.get = () => {
  const uri = GET_DASHBOARD_URL
  return rp({uri, json: true}).then(response => console.log('dashboard data returned'))
}

module.exports = Dashboard
