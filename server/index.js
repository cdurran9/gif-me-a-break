const path = require('path');
const express = require('express');
const http = require('http');

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

io.on('connection', socket => {
  const roomCode = socket.handshake.query.roomCode;
  console.log(`Client ${socket.id} connected with query: ${roomCode}`);
  socket['_roomCode'] = roomCode;

  const foundRoom = rooms[roomCode];
  if (!foundRoom) {
    rooms[roomCode] = {players: [socket.id]};
  } else {
    foundRoom.players.push(socket.id);
  }

  // client.broadcast.emit('Players:')
  socket.on('message', (msg) => {
    console.log('client says: ' + msg);
    io.emit('message', 'hi back');
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected: ${reason}`);
    const roomCode = socket['_roomCode'];
    // console.log(`They were in room ${roomCode}`);
    if (roomCode) {
      const room = rooms[roomCode];
      // console.log(`The room looks like this: ${JSON.stringify(room)}`);
      if (room) {
        const myPlayerIndex = room.players.indexOf(socket.id);
        // console.log(`They were player index ${myPlayerIndex}`);
        if (myPlayerIndex !== undefined) {
          room.players.splice(myPlayerIndex, 1);
          // console.log(`After they were removed, the room looks like this: ${JSON.stringify(room)}`);
          if (!room.players.length) {
            delete rooms[roomCode];
            console.log(`Last player left. Room ${roomCode} was deleted.`);
          }
        }
      }
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

server.listen(PORT, () => {
  console.log('Socket listening on port' + PORT);
});
