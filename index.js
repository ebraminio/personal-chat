const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
  ws.on('message', data => {
    var clients = Array.from(wss.clients);
    wss.clients.forEach(client => {
      var id = clients.indexOf(ws);
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'msg',
          id: id,
          msg: data
        }));
      }
    });
  });
});

setInterval(() => {
  var clients = Array.from(wss.clients);
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'status',
      id: clients.indexOf(client) + 1,
      count: clients.length
    }));
  });
}, 5000);

var server = http.createServer((req, res) => {
  switch (req.url) {
    case '/ws': return;

    case '/react.js':
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      return fs.createReadStream('node_modules/react/umd/react.production.min.js').pipe(res);

    case '/react-dom.js':
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      return fs.createReadStream('node_modules/react-dom/umd/react-dom.production.min.js').pipe(res);

    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream('chat.html').pipe(res);

    default: return res.end();
  }
});

server.on('upgrade', (request, socket, head) => {
  switch (request.url) {
  case '/ws':
    return wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
    
  default:
    return socket.destroy();
  }
});

server.listen(+process.env.PORT || 2040);
console.log('http://127.0.0.1:2040');
process.on('uncaughtException', console.log);