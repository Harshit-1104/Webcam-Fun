// Module dependencies

var app = require('../app');
var debug = require('debug')('webcamserver:server'); //Not understood completely
var http = require('http');
var https = require('https');
const { normalize } = require('path');
const fs = require('fs');

// Get the port

var port = normalizePort(process.env.PORT || '3000');   // Either i provide or default is 3000
app.set('port', port);

// Creating HTTP server

var server = http.createServer(app);

// Listen on provided port, on all network interfaces.

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// var options = {
//   key: fs.readFileSync(__dirname + '/private.key'),
//   cert: fs.readFileSync(__dirname + '/certificate.pem')
// };

// var secureServer = https.createServer(options, app);

// secureServer.listen(app.get('secPort'), () => {
//   console.log('Secure server listening on port ', app.get('secPort'));
// });

// secureServer.on('error', onError);
// secureServer.on('listening', onListening);

// Normalize a port into a number, string or false

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

// Event listener for http server 'error' event

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }  
}

// Event listenenr for http server 'listening' event.

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}