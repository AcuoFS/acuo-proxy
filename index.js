// import external libraries
//require('dotenv').config()

// app name
const name = 'ACUO Proxy'

const host = process.env.DOCKER_HOST || ''
const port = process.env.DOCKER_PORT || 8081
const env = process.env.DOCKER_ENV || 'dev'

// create server
const restify = require('restify')
const server = restify.createServer({name})

// register pluginsnpm
server.use(restify.queryParser())
// server.use(restify.CORS({
//   //credentials: true,                 // defaults to false
//   origins: [],
//   methods: ['GET','POST','OPTIONS']
// }))
server.use(restify.bodyParser({mapParams: false}))
server.use(restify.authorizationParser())
// add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
// enable preflight (for chrome)
const preflightEnabler = require('se7ensky-restify-preflight')
preflightEnabler(server, {'headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'})

// ===============================
// register routers
require('./app/routes').forEach(router => router({server}))

// ===============================
// start server
server.listen(port, host, () => {
  console.log(`${server.name} is listening at ${server.url}`)
})
