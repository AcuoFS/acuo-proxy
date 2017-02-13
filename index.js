'use strict'

// 3rd party Lib
const _ = require('lodash')

// env
const Env = require('app/env')

// app name
const name = 'ACUO Proxy'

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
require('app/routes')(server)


// ===============================
// start server
const port = _.get(Env, 'SERVER_PORT', 80)

server.listen(process.env.port || port, () => {
  console.log(`${server.name} is listening at ${server.url}`)
})