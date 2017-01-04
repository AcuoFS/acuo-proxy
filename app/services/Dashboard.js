//import external library
const rp = require('request-promise');

// main object
const Dashboard = {}

// get forex items
Dashboard.getItems = () => new Promise((resolve, reject) => {
  rp('http://margin.acuo.com/acuo/api/margin/dashboard')
    .then((dashboard) => {
      // successfull
        resolve(dashboard)
    })
    .catch((err) => {
        console.log(err)
    })
  })
})

module.exports = Dashboard
