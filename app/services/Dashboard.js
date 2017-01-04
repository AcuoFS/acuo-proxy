//import external library
const rp = require('request-promise')

// main object
const Dashboard = {}

// get forex items
Dashboard.get = () => {
  return rp('http://margin.acuo.com/acuo/api/margin/dashboard').then(JSON.parse)
}

module.exports = Dashboard
