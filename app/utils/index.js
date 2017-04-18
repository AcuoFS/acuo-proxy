const isString = (varToCheck) => {
  return (typeof varToCheck === 'string' || varToCheck instanceof String)
}

module.exports = {
  isString
}