// import external library
const rp = require('request-promise')

// main object
const Dashboard = {}

// get Dashboard items
Dashboard.get = () => {
  const uri = 'http://margin.acuo.com/acuo/api/margin/dashboarda'
  return rp({uri, json: true})
}

module.exports = Dashboard
