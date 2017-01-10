// import libs
const fs = require('fs')
const _ = require('lodash')

// import utils
const cache = require('../common/Cache')

// config
const fsPath = './app/cache/'
const requirePath = '../cache/'

// main obj
const FsCache = {}

// set data in FsCache
FsCache.set = ({key, data}) => {
  const fsKey = generateKey(fsPath, key)

  // write file is async
  fs.writeFile(fsKey, JSON.stringify(data))

  // return cache set promise
  return cache.set(key, data)
}

// get data from FsCache
FsCache.get = (key) => new Promise((resolve, reject) => {
  const requireKey = generateKey(requirePath, key)

  cache.get(key)
    // hit cache
    .then(json => resolve(json))
    // hit fs
    .catch(err => {
      const json = require(requireKey)
      resolve(json)
    })
})


// ==================================================
// internal function
// transform key so that it is a valid file name
const generateKey = (prefix, key) => prefix + key.replace(/\//g, '_') + '.json'


module.exports = FsCache
