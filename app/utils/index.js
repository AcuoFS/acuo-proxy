const DB = require('./Neo4JConnector')

const isString = (varToCheck) => {
  return (typeof varToCheck === 'string' || varToCheck instanceof String)
}

module.exports = {
  isString,
  DB
}