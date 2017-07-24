// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UploadPortfolioService, FsCacheService } = require('../services')
// const multiparty = require('multiparty')
const request = require('request')
const fs = require('fs')
// const multer = require('multer')
var FormData = require('form-data')
const rp = require('request-promise')

// main object
const routerInstance = new Router()

// constants
const prefix = "upload"

const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {
  POST_UPLOAD_PORTFOLIO
} = config

// var upload = multer({dest: 'json/'})

routerInstance.post('/', (req, res, next) => {
  console.log('attempting upload portfolio')

  var form = new FormData();
  const list = Object.keys(req.files)

  list.map(x => {
    var file = req.files[x];
    var buffer = fs.readFileSync(file.path);
    form.append('file', buffer, file.name)
  })

  const options = {
      method: 'POST',
      headers: form.getHeaders(),
      body: form
  };

  rp(POST_UPLOAD_PORTFOLIO, options).then(response => console.log(response))  
})

routerInstance.post('/testroute', (req, res, next) => {
  console.log('here')
  console.log(req)
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)