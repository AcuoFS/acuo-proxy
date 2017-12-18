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
//   origins: ['http://localhost:8080'],
//   methods: ['GET','POST','OPTIONS']
// }))

server.use(restify.bodyParser({mapParams: false, defer: true}))
server.use(restify.authorizationParser())
// add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
// enable preflight (for chrome)
const preflightEnabler = require('se7ensky-restify-preflight')
preflightEnabler(server, {'headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'})

// ===============================
// register routers
require('./app/routes').forEach(router => router({server}))

// server.server.setTimeout(60000*5)

// ===============================
// start server
const app = server.listen(port, host, () => {
  console.log(`${server.name} is listening at ${server.url}`)
})

const io = require("socket.io").listen(app)
const ioToServer = require("socket.io-client")

console.log('new instance')

io.of('/uploadStream')
  .on('connection', socketToClient => {

    console.log('new connection')
    const socketToServer = ioToServer('http://localhost:8082/uploadStream')

    const userName = 'user@acuocpty.com'
    console.log(Object.keys(io.sockets.sockets))
    // console.log(id)

    socketToServer.on('connect', function(){
      console.log('connected to server')
      console.log('listning to ' + socketToServer.io.engine.id)
      socketToServer.on(socketToServer.io.engine.id, data => {
        //socketToClient.to(socketToClient.conn.id, data.payload)
        console.log(`from ${socketToServer.io.engine.id} to ${data.user}`)
        console.log(data.payload)
        // socketToClient.to(socketToClient.conn.id).emit('message', data.payload)
        socketToClient.emit('message', data.payload)

        // socketToClient.emit('test', 'pewpew')
      })
    });
    socketToServer.on('event', function(data){

    });
    socketToServer.on('disconnect', function(){
      console.log('server dc')
    });

    // socketToClient.on('room', room => {
    //   console.log('joining ' + room)
    //   socketToClient.join(room)
    // })

    socketToClient.on('disconnect', () => {
      console.log('client dc')
      socketToServer.disconnect()
      setTimeout(() => {
        console.log(Object.keys(io.sockets.sockets))
      }, 500)
    })

  }).on('disconnect', socket => {
    console.log('someone dced')
  })