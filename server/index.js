const path = require('path');
const express = require('express');
const http = require('http');

const PORT = process.env.PORT || 3001;
const SOCKET_PORT = 3002;

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

io.on('connection', client => {
  console.log('connected: ' + client.id);
  client.on('message', (msg) => {
    console.log('client says: ' + msg);
  })
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

server.listen(PORT, () => {
  console.log('Socket listening on port' + SOCKET_PORT);
});
