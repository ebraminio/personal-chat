// copied from https://github.com/shanet/WebRTC-Example

const HTTPS_PORT = 8443;

const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

// ----------------------------------------------------------------------------------------

var server = http.createServer(function (request, response) {
  // Render the single client html file for any request the HTTP server receives
  console.log('request received: ' + request.url);
  
  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('chat2.html'));
  }
});

// ----------------------------------------------------------------------------------------

const wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    // Broadcast any received message to all clients
    console.log('received: %s', message);
    wss.broadcast(message);
  });
});

wss.broadcast = function (data) {
  this.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

server.listen(+process.env.PORT || 2040);
console.log('http://127.0.0.1:2040');