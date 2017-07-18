// import libs
const Router = require('restify-router').Router
const _ = require('lodash')
// import services
const { UploadPortfolioService, FsCacheService } = require('../services')
const multiparty = require('multiparty')

// main object
const routerInstance = new Router()

// constants
const prefix = "upload"

const config = require('../constants/config').get(process.env.DOCKER_ENV)
const {
  POST_UPLOAD_PORTFOLIO
} = config

routerInstance.post('/', (req, res, next) => {
  console.log('attempting upload portfolio')
  //console.log(req)
  // let objToSend = req
  // UploadPortfolioService.postUpload(req).then(data => {
  //   console.log('posting upload portfolio resolved')
  //   res.send(data)
  //   console.log('posting upload portfolio returned')
  // }).catch(err => {
  //   console.log('posting upload portfolio did not resolve')
  //   //console.log(err)
  //   res.send(err)
  // })

  var form = new multiparty.Form();

  form.on('part', function(formPart) {
    var contentType = formPart.headers['content-type'];

    var formData = {
      file: {
        value: formPart,
        options: {
          filename: formPart.filename,
          contentType: contentType,
          knownLength: formPart.byteCount
        }
      }
    };

    UploadPortfolioService.postUpload({
      url: POST_UPLOAD_PORTFOLIO,
      formData: formData,

      // These may or may not be necessary for your server:
      preambleCRLF: true,
      postambleCRLF: true
    });
  });

  form.on('error', function(error) {
    next(error);
  });

  form.on('close', function() {
    response.send('received upload');
  });

  form.parse(req);
})

routerInstance.post('/testroute', (req, res, next) => {
  console.log('here')
  console.log(req)
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)