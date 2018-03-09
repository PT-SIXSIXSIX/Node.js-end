var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var jwtAuth = require('./utils/jwt-auth');
var urlencodedParser = bodyParser.urlencoded({extended: false});

//
// Create your proxy server and set the target in the options.
//
var httpProxy = require('http-proxy');
// Error example
//
// Http Proxy Server with bad target
//
// function filter (pathname, req){
//   return (pathname.match('^/api') && req.method === 'POST');
// };

var proxy = httpProxy.createServer({
  target:'http://localhost:8081',
});

proxy.listen(8005);

//
// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

//
// Listen for the `proxyRes` event on `proxy`.
//
proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

//
// Listen for the `open` event on `proxy`.
//
proxy.on('open', [urlencodedParser, jwtAuth], function (proxySocket) {
  // listen for messages coming FROM the target here
  proxySocket.on('data', hybiParseAndLogMessage);
});

//
// Listen for the `close` event on `proxy`.
//
proxy.on('close', function (res, socket, head) {
  // view disconnected websocket connections
  console.log('Client disconnected');
});
