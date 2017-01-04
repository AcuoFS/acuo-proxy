const LRU = require('bluebird-lru-cache')

const cache = LRU({
  max: 500,
  maxAge: 1000 * 60 * 60,
})

module.exports = cache
