const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, { pingTimeout: 300000,
                                    cors: { origin: "*",
                                            methods: ["GET"]
                                          } });

const Rooms = require('./rooms');
const Utils = require('./utils');

const port = process.env.PORT || 99;
const path = require('path');

function forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, timeout, keepPlaying = true) {
  let forcedPlayer = nextPlayer;
  let room = Rooms.data[roomCode] || {};
  let timerDelay = timeout ? 0 : 3000;
  if (!room.players[forcedPlayer].turn) {
    return;
  }
  io.to(roomCode).emit('check', response => {
    if (response) {
      if ((!room.players[forcedPlayer].active || timeout) && keepPlaying) {
        let username = room.players[forcedPlayer].username;

        clearTimeout(room.playTimer);

        let { total,
              cardObj,
              reverseChange,
              newPlayer,
              newRound,
              players,
              gameOver } = Rooms.forcePlay(forcedPlayer, roomCode, syncTotal, reverse);

        let formattedPlayers = Utils.formatPlayers(players, room.players[forcedPlayer].playerId);

        forcedPlayer = newPlayer;
        if (room.players[forcedPlayer].active) {
          io.to(room.players[forcedPlayer].socket).emit('check', (response) => {
            if (!response) {
              room.players[forcedPlayer].active = false;
            }
          });
        }

        let playTimer = setTimeout(() => {
          forcePlayCard(forcedPlayer, roomCode, total, reverse, true, true);
        }, timerDelay + 17000);

        clearTimeout(room.playTimer);
        room.playTimer = playTimer;

        keepPlaying = !gameOver;

        setTimeout(() => {
          forcePlayCard(forcedPlayer, roomCode, total, reverse, false, keepPlaying);

          if (newRound) {
            clearTimeout(room.playTimer);

            room.players.forEach((player, i) => {
              io.to(player.socket).emit('newRound', formattedPlayers.playerObjects, i, username, formattedPlayers.strikes, player.hand);
            })
          } else if (keepPlaying) {
            timeout && io.to(room.players[nextPlayer].socket).emit('hand',room.players[nextPlayer].hand);

            room.players.forEach((player, i) => {
              io.to(player.socket).emit('nextTurn', formattedPlayers.playerObjects, i, total, cardObj, reverseChange);
            })

          } else {
            clearTimeout(room.playTimer);

            room.players.forEach((player, i) => {
              io.to(player.socket).emit('gameOver', formattedPlayers.playerObjects, i);
            })
          }
        }, timerDelay);
      }
    } else {
      Rooms.deleteRoom(roomCode);
    }
  })

}

io.on('connection', (socket) => {

  socket.on('getRoomCode', () => {
    let roomCode = Rooms.generateRoomCode('');

    io.to(socket.id).emit('roomCode', roomCode);
  });

  socket.on('deleteRoomCode', (roomCode) => {
    Rooms.deleteRoom(roomCode);
  });

  socket.on('replay', (roomCode, playerId) => {
    let room = Rooms.data[roomCode] || {};

    if (room.players) {
      if (!room.players.some((player) => player.playerId === playerId)) {
        return;
      }

      if (room.players[0].playerId === playerId) {
        Rooms.replay(roomCode);

        let players = Utils.formatPlayers(room.players, socket.id);

        room.players.forEach((player, i) => {
          io.to(player.socket).emit('players', players.playerObjects, i, true, player.hand);
        })
      }
    }
  })

  socket.on('roomCheck', (roomCode, password) => {
    let error = {};
    let room = Rooms.data[roomCode] || error;

    io.to(socket.id).emit('roomResult', room.password === password, room !== error, roomCode);
  });

  socket.on('create', (roomCode, playerId, password, username, limit) => {
    socket.join(roomCode);

    let room = Rooms.create(roomCode, password, username, limit, playerId ? playerId : socket.id, socket.id);

    let players = Utils.formatPlayers(room.players, playerId);

    if (players) {
      io.to(socket.id).emit('players', players.playerObjects, 0, false, players.hand, true);
    }

  });

  socket.on('password', (roomCode, password) => {
    let room = Rooms.data[roomCode] || {}
    let valid = false;

    if (room.password === password) {
      valid = !valid;
    }

    io.to(socket.id).emit('passwordCheck', valid);
  })

  socket.on('startTimer', (roomCode, playerId) => {
    let room = Rooms.data[roomCode];
    if (!room.players.some((player) => player.playerId === playerId)) {
      return;
    }

    let playTimer = setTimeout(() => {
      forcePlayCard(0, roomCode, 0, false, true);
    }, 20000);

    clearTimeout(room.playTimer);
    room.playTimer = playTimer;
  });

  socket.on('enter', (roomCode, playerId, hasPassword) => {
    let error = {}
    let room = Rooms.data[roomCode] || error;

    if (!playerId) {
      playerId = socket.id;
    }
    io.to(socket.id).emit('playerId', playerId);

    if (room === error) {
      io.to(socket.id).emit('enterCheck', 'That room does not exist.');
    } else if (!room.players) {
      socket.join(roomCode);
      room.players = true;
      io.to(socket.id).emit('enterCheck', 'OK', true);
    } else if (room.players && room.created) {
      if (!hasPassword) {
        hasPassword = room.players.some(player => player.playerId === playerId);
      }

      if (hasPassword) {
        let players = Utils.formatPlayers(Rooms.addOrFindPlayer(roomCode, playerId, socket.id), playerId);
        if (players) {
          socket.join(roomCode);

          let owner = room.players[0].socket === socket.id;

          io.to(socket.id).emit('enterCheck', 'OK', owner, players.username !== 'Waiting...' ? players.hand : undefined, players.username);

          let waiting = false;
          room.players.forEach((player, i) => {
            waiting = player.username === 'Waiting...';

            io.to(player.socket).emit('check', (response) => {

              if (!response) {
                player.active = false;

              } else if (player.playerId !== playerId) {
                io.to(player.socket).emit('playerEnter', players.playerObjects, i, room.playTimer._idleTimeout);
              }
              if (i === room.players.length - 1) {
                let activePlayers = room.players.filter(player => player.playerId !== playerId && player.active);

                if (activePlayers.length) {
                  io.to(socket.id).emit('playerEnter', players.playerObjects, i, room.playTimer._idleTimeout);
                  io.to(activePlayers[0].socket).emit('getGameState', players.index);

                } else {
                  let nextPlayer = room.players.filter(player => player.turn)[0];

                  let playTimer = setTimeout(() => {
                    forcePlayCard(nextPlayer.index, roomCode, room.total, room.reverse, false);
                  }, 3000);

                  clearTimeout(room.playTimer);
                  room.playTimer = playTimer;

                  let updatePlayers = Utils.formatPlayers(room.players, playerId);
                  io.to(socket.id).emit('playerEnter', updatePlayers.playerObjects, updatePlayers.index, room.playTimer._idleTimeout);
                  io.to(socket.id).emit('gotGameState', -1, room.total, room.reverse, room.discard, waiting);
                }
              }
            })
          })

        } else {
          io.to(socket.id).emit('enterCheck', 'That room is full.');
        }
      } else if (!room.full) {
        io.to(socket.id).emit('getPassword');
      } else {
        io.to(socket.id).emit('enterCheck', 'That room is full.');
      }
    } else {
      io.to(socket.id).emit('enterCheck', 'That room does not exist.');
    }
  })

  socket.on('disconnect', (roomCode, index) => {
    if (roomCode) {
      socket.leave(roomCode);
      let room = Rooms.data[roomCode] || {};
      if (room.players && index > -1) {
        room.players[index].active = false;
      }
    }
  })

  socket.on('currentGameState', (roomCode, playerId, countdown, index) => {
    let room = Rooms.data[roomCode] || {};
    if (!room.players.some((player) => player.playerId === playerId)) {
      return;
    }

    let socketId = room.players[index].socket;
    let waiting = room.players.some(player => player.username === 'Waiting...');

    io.to(socketId).emit('gotGameState', countdown, room.total, room.reverse, room.discard, waiting);
  })

  socket.on('username', (roomCode, username, playerId) => {
    let room = Rooms.data[roomCode] || {};

    if (!room.players.some((player) => player.playerId === playerId)) {
      return;
    }

    if (room.players) {
      let exists = room.players.filter(player => player.username === username);
      if (!exists.length) {
        io.to(socket.id).emit('usernameCheck', false, username);
        let players = Utils.formatPlayers(Rooms.addOrFindPlayer(roomCode, playerId, socket.id, username), playerId);

        if (players) {
          room.players.forEach((player, i) => {
            io.to(player.socket).emit('players', players.playerObjects, i);
          })
          io.to(socket.id).emit('hand', players.hand);
        }
      } else {
        io.to(socket.id).emit('usernameCheck', true);
      }
    }
  });

  socket.on('playCard', (cardObj, roomCode, reverse, syncTotal, currentPlayer, nextPlayer, playerId) => {
    let room = Rooms.data[roomCode] || {};
    if (!room.players[currentPlayer].turn || !room.players.some((player) => player.playerId === playerId)) {
      return;
    }
    room.reverse = reverse;
    io.to(socket.id).emit('playerId', playerId);

    clearTimeout(room.playTimer);
    room.total = syncTotal;
    room.discard.push(cardObj);

    let players = Utils.formatPlayers(Rooms.playCard(roomCode, cardObj, currentPlayer, nextPlayer), playerId);
    let playTimer = setTimeout(() => {
      forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, true);
    }, 17000);

    room.playTimer = playTimer;

    room.players.forEach((player, i) => {
      socket.to(player.socket).emit('nextTurn', players.playerObjects, i, syncTotal, cardObj, reverse);
    })

    io.to(socket.id).emit('hand', players.hand);

    if (room.players[nextPlayer].active) {
      io.to(room.players[nextPlayer].socket).emit('check', (response) => {
        if (!response) {
          room.players[nextPlayer].active = false;
          forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, false);
        }
      });
    } else {
      forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, false);
    }
  })

  socket.on('newRound', (roomCode, currentPlayer, nextPlayer, playerId, reverse) => {
    let room = Rooms.data[roomCode] || {};

    if (!room.players.some((player) => player.playerId === playerId)) {
      return;
    }

    let { players, newRound } = Rooms.newRound(roomCode, currentPlayer, nextPlayer);
    players = Utils.formatPlayers(players, playerId);
    room.total = 0;
    room.discard = [];

    if (newRound) {

      room.players.forEach((player, i) => {
        io.to(player.socket).emit('newRound', players.playerObjects, i, room.players[currentPlayer].username, room.players[currentPlayer].strikes, player.hand);
      })

      let playTimer = setTimeout(() => {
        room.players[nextPlayer].active = false;
        forcePlayCard(nextPlayer, roomCode, 0, reverse, true);
      }, 20000);

      clearTimeout(room.playTimer)
      room.playTimer = playTimer;

      setTimeout(() => {
        if (room.players[nextPlayer].active) {
          io.to(room.players[nextPlayer].socket).emit('check', (response) => {
            if (!response) {
              room.players[nextPlayer].active = false;
              forcePlayCard(nextPlayer, roomCode, 0, reverse, false);
            }
          });
        } else {
          forcePlayCard(nextPlayer, roomCode, 0, reverse, false);
        }
      }, 2500)

    } else {
      clearTimeout(room.playTimer);

      room.players.forEach((player, i) => {
        io.to(player.socket).emit('gameOver', players.playerObjects, i);
      });
    }

  })

  socket.on('getHand', (roomCode, playerId) => {
    let room = Rooms.data[roomCode] || {};
    let player = room.players.filter(player => player.playerId === playerId);

    if (!player.length) {
      return;
    }

    io.to(socket.id).emit('hand', player[0].hand);
  })

  socket.on('endGame', (roomCode, playerId) => {
    let room = Rooms.data[roomCode] || {};

    if (room.players) {
      if (!room.players.some((player) => player.playerId === playerId)) {
        return;
      }

      if (room.players[0].playerId === playerId) {
        io.to(roomCode).emit('gameEnded');

        setTimeout(() => {
          Rooms.deleteRoom(roomCode);
        }, 1000);
      }
    }
  })

  socket.on('sendMessage', (message) => {

  });

  socket.on('disconnection', (data) => {

  });

})

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
  res.sendStatus(200);
})

app.get('/room/:roomCode', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('/select', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('/computers', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});