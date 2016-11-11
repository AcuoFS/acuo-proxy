'use strict'

// 3rd party Lib
const _ = require('lodash')

// conf
const Conf = require('app/conf')('server')

// app name
const appName = 'ACUO Proxy'

// create server
const restify = require('restify')
const server = restify.createServer({
  name: appName,
})

// register plugins
server.use(restify.queryParser({mapParams: false}))
server.use(restify.bodyParser({mapParams: false}))

// ===============================
// load routers: app/routes/*
// ===============================
require('app/routes/home')(server)

// start server
const port = _.get(Conf, 'port', 80)

server.listen(port, () => {
  console.log(`${server.name} is listening at ${server.url}`)
})