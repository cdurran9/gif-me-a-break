const ioSetup = (io, rooms) => {
  io.on('connection', socket => {
    const roomCode = socket.handshake.query.roomCode;
    const playerName = socket.handshake.query.playerName;
    console.log(`Client ${socket.id} connected with query: ${roomCode}`);
    socket['_roomCode'] = roomCode;
  
    let foundRoom = rooms[roomCode];
    if (!foundRoom) {
      rooms[roomCode] = {players: [{id: socket.id, name: playerName}]};
      foundRoom = rooms[roomCode];
    } else {
      foundRoom.players.push({id: socket.id, name: playerName});
    }
  
    socket.join(roomCode);
    io.sockets.in(roomCode).emit('playerJoin', { playerName, players: foundRoom.players });
  
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
          const myPlayerIndex = room.players.findIndex(player => player.id === socket.id);
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
}

module.exports = ioSetup;