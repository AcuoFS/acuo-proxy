// import external libraries
//require('dotenv').config()

// app name
const name = 'ACUO Proxy'

var host = process.env.DOCKER_HOST || '';
var port = process.env.DOCKER_PORT || 8081;

// create server
const restify = require('restify')
const server = restify.createServer({name})

// register pluginsnpm
server.use(restify.queryParser())
server.use(restify.CORS())
server.use(restify.bodyParser({mapParams: false}))
server.use(restify.authorizationParser())

// enable preflight (for chrome)
const preflightEnabler = require('se7ensky-restify-preflight')
preflightEnabler(server, {'Access-Control-Allow-Origin': '[*]'})

// ===============================
// register routers
require('./app/routes').forEach(router => router({server}))

// ===============================
// start server
server.listen(port, host, () => {
  console.log(`${server.name} is listening at ${server.url}`)
})
