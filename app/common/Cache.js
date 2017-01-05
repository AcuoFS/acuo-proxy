const LRU = require('bluebird-lru-cache')

const cache = LRU({
  // max 500 records
  // max: 500,
  // 1 hour life time
  // maxAge: 1000 * 60 * 60 *,
})

module.exports = cache
