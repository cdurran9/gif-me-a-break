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

io.on('connection', client => {
  const roomCode = client.handshake.query.roomCode;
  console.log(`Client ${client.id} connected with query: ${roomCode}`);
  client['_roomCode'] = roomCode;

  const foundRoom = rooms[roomCode];
  if (!foundRoom) {
    rooms[roomCode] = {players: [client.id]};
  } else {
    foundRoom.players.push(client.id);
  }

  // client.broadcast.emit('Players:')
  client.on('message', (msg) => {
    console.log('client says: ' + msg);
    io.emit('message', 'hi back');
  });

  client.on('disconnect', (reason) => {
    console.log(`Client ${client.id} disconnected: ${reason}`);
    const roomCode = client['_roomCode'];
    // console.log(`They were in room ${roomCode}`);
    if (roomCode) {
      const room = rooms[roomCode];
      // console.log(`The room looks like this: ${JSON.stringify(room)}`);
      if (room) {
        const myPlayerIndex = room.players.indexOf(client.id);
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
