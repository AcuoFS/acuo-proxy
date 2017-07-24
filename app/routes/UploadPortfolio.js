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

  // console.log(req.files)

  const list = Object.keys(req.files)
  // console.log(list)

  list.map(x => {
    //console.log(req.files[x])
    form.append('file', fs.createReadStream(req.files[x].path + '/' + req.files[x].name))
  })

   //console.log(form)
  //console.log('here')
  console.log(req.headers)
  rp({
    method: req.method,
    url: POST_UPLOAD_PORTFOLIO,
    files: form,
    headers: {
      'content-type': 'multipart/form-data; boundary=' + form._boundary
    },
    body: JSON.stringify(req.body),
    resolveWithFullResponse: true
  }).then(response => console.log(response))

  // form.append('file', fs.createReadStream('/foo/bar.jpg'));

  //console.log(req.files)
  //console.log(req)

  //console.log(req)
  //let objToSend = req
  //return UploadPortfolioService.postUpload(req, res)
 // console.log(req.files)
 //  request.post({
 //    url: POST_UPLOAD_PORTFOLIO,
 //    method: req.method,
 //    headers: req.headers,
 //    // files: req.files,
 //    body: JSON.stringify(req.body),
 //    resolveWithFullResponse: true
 //  }).on('response', response => {
 //    console.log('response')
 //    console.log(response)
 //  }).on('error', error => {
 //    console.log('error')
 //    console.log(error)
 //  })

  // let x = request({
  //     url: POST_UPLOAD_PORTFOLIO,
  //     method: req.method,
  //     headers: _.omit(req.headers, ['host']),
  //     files: req.files,
  //     //body: JSON.stringify(req.body),
  //     resolveWithFullResponse: true
  //   })
  //
  // //console.log(POST_UPLOAD_PORTFOLIO)
  //
  // req.pipe(x).on('end', response => {
  //   console.log(response)
  //   console.log('ended')
  // }).pipe(res).on('finish', response => {
  //   console.log('finished')
  //   console.log(response)
  // })

  // var formidable = require('formidable')
  //
  // var form = new formidable.IncomingForm();
  // console.log('here')
  // form.parse(req, (err, fields, files) => {
  //   // var data = files.qqfile;
  //   //actual file is at data.path
  //   // fs.createReadStream(data.path).pipe(request.post(POST_UPLOAD_PORTFOLIO))
  //   console.log('in')
  //   console.log(error)
  //   console.log(fields)
  //   console.log(files)
  // })

  // req.pipe(x).on('response', response => {
  //   console.log('response')
  //   console.log(response)
  // }).on('error', error => {
  //   console.log('error')
  //   console.log(error)
  // })
  //
  // x.pipe(res)


  // UploadPortfolioService.postUpload(req, res).then(data => {
  //   console.log('posting upload portfolio resolved')
  //   res.send(data)
  //   console.log('posting upload portfolio returned')
  // }).catch(err => {
  //   console.log('posting upload portfolio did not resolve')
  //   //console.log(err)
  //   res.send(err)
  // })

  // var form = new multiparty.Form();
  //
  // form.on('part', function(formPart) {
  //
  //   console.log('on part')
  //   var contentType = formPart.headers['content-type'];
  //
  //   var formData = {
  //     file: {
  //       value: formPart,
  //       options: {
  //         filename: formPart.filename,
  //         contentType: contentType,
  //         knownLength: formPart.byteCount
  //       }
  //     }
  //   };
  //
  //   console.log('on part 2')
  //
  //   UploadPortfolioService.postUpload({
  //     url: POST_UPLOAD_PORTFOLIO,
  //     formData: formData,
  //
  //     // These may or may not be necessary for your server:
  //     preambleCRLF: true,
  //     postambleCRLF: true
  //   }).then(response=>
  //     console.log('on part 3')
  //   ).catch(error =>
  //     console.log(error)
  //   );
  // });
  //
  // form.on('error', function(error) {
  //   console.log('on error')
  //
  //   next(error);
  // });
  //
  // form.on('close', function() {
  //   console.log('on close')
  //
  //   response.send('received upload');
  // });
  //
  // console.log('on parse')

  //form.parse(req);
})

routerInstance.post('/testroute', (req, res, next) => {
  console.log('here')
  console.log(req)
})

module.exports = ({server}) => routerInstance.applyRoutes(server, prefix)