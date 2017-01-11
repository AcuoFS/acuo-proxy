// import external library
const rp = require('request-promise')

// main object
const Dashboard = {}

// get Dashboard items
// Dashboard.get = () => {
//   const uri = 'http://margin.acuo.com/acuo/api/margin/dashboard'
//   return rp({uri, json: true})
// }

Dashboard.get = () => new Promise(resolve => {
  const json = require('../json/dashboard.json')
  resolve(json)
})

module.exports = Dashboard
