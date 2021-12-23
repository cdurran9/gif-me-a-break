const path = require('path');
const express = require('express');
const http = require('http');
const ioSetup = require('./io-setup');

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let rooms = {};

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/check-room/:roomCode', (req, res) => {
  const foundRoom = rooms[req.params.roomCode];
  res.json({ valid: foundRoom !== undefined });
});

ioSetup(io, rooms);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

server.listen(PORT, () => {
  console.log('Socket listening on port' + PORT);
});
