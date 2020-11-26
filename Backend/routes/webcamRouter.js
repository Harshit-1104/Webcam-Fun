const express = require('express')
const bodyParser = require('body-parser')
const webcamRouter = express.Router();
var path = require('path');
var authenticate = require('../authenticate');

webcamRouter.use(bodyParser.json());

webcamRouter.route('/')
  .get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 200;
    res.sendFile(path.join(__dirname, '../public/webcam.html'))
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported!');
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported!');
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported!');
  });

module.exports = webcamRouter;