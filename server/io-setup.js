const GAME_PHASE_LENGTHS = {
  text: 60,
  gifTags: 60,
  combo: 180,
};

const phase = (key) => {
  return (GAME_PHASE_LENGTHS[key] || 60) * 1000;
};

const ioSetup = (io, rooms) => {
  let textPhaseTimer;
  let gifTagPhaseTimer;
  let comboTimer;

  io.on('connection', (socket) => {
    const roomCode = socket.handshake.query.roomCode;
    const playerName = socket.handshake.query.playerName;

    const startTextPhase = () => {
      rooms[roomCode].gameRunning = true;
      console.log(`Room ${roomCode} is starting`);
      io.sockets.in(roomCode).emit('gameStart');
      textPhaseTimer = setTimeout(() => {
        startGifPhase();
      }, phase('text'));
    };

    const startGifPhase = () => {
      console.log(`Room ${roomCode} is starting GIF tag phase`);
      io.sockets.in(roomCode).emit('changeGamePhase', { phase: 'gifs' });
      gifTagPhaseTimer = setTimeout(() => {
        startComboPhase();
      }, phase('gifTags'));
    };

    const startComboPhase = () => {
      console.log(`Room ${roomCode} is starting combo`);
      io.sockets.in(roomCode).emit('changeGamePhase', {
        phase: 'combos',
        tags: rooms[roomCode].submittedGifTags,
        texts: rooms[roomCode].submittedTexts,
      });
      comboTimer = setTimeout(() => {
        startShowcasePhase();
      }, phase('combo'));
    };

    const startShowcasePhase = () => {
      console.log(`Room ${roomCode} is starting showcase phase`);
      io.sockets.in(roomCode).emit('changeGamePhase', { phase: 'showcase', data: rooms[roomCode].submittedCombos });
    };

    console.log(`Client ${socket.id} connected with query: ${roomCode}`);
    socket['_roomCode'] = roomCode;

    let foundRoom = rooms[roomCode];
    if (!foundRoom) {
      rooms[roomCode] = {
        players: [
          {
            id: socket.id,
            name: playerName,
            vip: true,
            texts: 0,
            gifTags: 0,
            combos: 0,
          },
        ],
        gameRunning: false,
        submittedTexts: [],
        submittedCombos: [],
        submittedGifTags: [],
      };
      foundRoom = rooms[roomCode];
    } else {
      foundRoom.players.push({
        id: socket.id,
        name: playerName,
        vip: false,
        texts: 0,
        gifTags: 0,
        combos: 0,
      });
    }

    socket.join(roomCode);
    io.sockets
      .in(roomCode)
      .emit('playerJoin', { playerName, players: foundRoom.players });

    socket.on('message', (msg) => {
      console.log('client says: ' + msg);
      io.emit('message', 'hi back');
    });

    socket.on('gameStart', () => {
      io.sockets.in(roomCode).emit('gameStartCountdown', { countdown: 5000 });
      setTimeout(() => {
        startTextPhase();
      }, 5000);
    });

    const checkSubmissions = (propName, min) => {
      const answer = foundRoom.players.every((player) => {
        console.log(
          `Checking if player ${player.name} has at least ${min} of ${propName}: they have ${player[propName]}`
        );
        return player[propName] >= min;
      });
      console.log(`Answer is ${answer}`);
      return answer;
    };

    socket.on('submitText', (data) => {
      foundRoom.submittedTexts.push({ playerId: socket.id, value: data });
      const player = foundRoom.players.find((p) => p.id === socket.id);
      player.texts += 1;
      console.log(`${player.name} submitted this text: ${data}`);

      if (checkSubmissions('texts', 4)) {
        clearTimeout(textPhaseTimer);
        startGifPhase();
      }
    });

    socket.on('submitGifTags', (data) => {
      const singleWord = data.toLowerCase().split(' ')[0];
      foundRoom.submittedGifTags.push({
        playerId: socket.id,
        value: singleWord,
      });
      const player = foundRoom.players.find((p) => p.id === socket.id);
      player.gifTags += 1;
      console.log(`${player.name} submitted this gif tag: ${singleWord}`);
      if (checkSubmissions('gifTags', 3)) {
        clearTimeout(gifTagPhaseTimer);
        startComboPhase();
      }
    });

    socket.on('submitCombo', (data) => {
      foundRoom.submittedCombos.push({ playerId: socket.id, value: data });
      const player = foundRoom.players.find((p) => p.id === socket.id);
      player.combos += 1;
      console.log(`${player.name} submitted their combo.`);
      if (checkSubmissions('combos', 1)) {
        clearTimeout(comboTimer);
        startShowcasePhase();
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      const roomCode = socket['_roomCode'];
      // console.log(`They were in room ${roomCode}`);
      if (roomCode) {
        const room = rooms[roomCode];
        // console.log(`The room looks like this: ${JSON.stringify(room)}`);
        if (room) {
          const myPlayerIndex = room.players.findIndex(
            (player) => player.id === socket.id
          );
          // console.log(`They were player index ${myPlayerIndex}`);
          if (myPlayerIndex !== undefined) {
            room.players.splice(myPlayerIndex, 1);
            // console.log(`After they were removed, the room looks like this: ${JSON.stringify(room)}`);
            if (!room.players.length) {
              delete rooms[roomCode];
              clearTimeout(textPhaseTimer);
              clearTimeout(gifTagPhaseTimer);
              clearTimeout(comboTimer);
              console.log(`Last player left. Room ${roomCode} was deleted.`);
            }
          }
        }
      }
    });
  });
};

module.exports = ioSetup;
