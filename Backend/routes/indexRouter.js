var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', (req, res, next) => {
  res.statusCode = 200;
  res.sendFile(path.join(__dirname, '../../ReactWebcam/webcam(ejected)/public/index.html'));  // here i will add a file from my react application
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

  module.exports = router;