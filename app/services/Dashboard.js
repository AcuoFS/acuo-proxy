// import external library
const rp = require('request-promise')

// main object
const Dashboard = {}

// get Dashboard items
Dashboard.get = () => {
  const uri = 'http://margin:7070/acuo/api/margin/dashboard'
  return rp({uri, json: true})
}

module.exports = Dashboard
