// import libs
const fs = require('fs')
const _ = require('lodash')

// import utils
const cache = require('../common/Cache')

// main obj
const FsCache = {}

// set data in FsCache
FsCache.set = ({key, data}) => {

  const disableCache = process.env.DOCKER_DISABLE_CACHE || 0
  let newData = {}

  if(!disableCache)
    newData = data

  const fsKey = generateKey(key)

  // write file is async
  fs.writeFile(fsKey, JSON.stringify(newData), (error) => {
    if (error) {
      console.log('Error: ' + error)
    }
    console.log('Caching done for: ' + key)
  })

  // return cache set promise
  return cache.set(key, newData)
}

// get data from FsCache
FsCache.get = (key) => new Promise((resolve, reject) => {
  const fsKey = generateKey(key)

  cache.get(key)
  // hit cache
    .then(resolve)
    // hit fs by requiring
    .catch(err => {
      fs.readFile(fsKey, 'utf8', (err, data) => resolve(JSON.parse(data)))
    })
})


// ==================================================
// internal function
// transform key so that it is a valid file name
const generateKey = (key) => './app/cache/' + key.replace(/\//g, '_') + '.json'


module.exports = FsCache
