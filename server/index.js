const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
//const http = require('http').createServer(app);
const cors = require('cors');
const httpServer = createServer(app);
const io = new Server(httpServer);

const Rooms = require('./rooms');
const Utils = require('./utils');

const port = process.env.PORT || 99;
const path = require('path');

function forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, timeout, keepPlaying = true) {
  let forcedPlayer = nextPlayer;
  let room = Rooms.data[roomCode] || {};
  let timerDelay = timeout ? 0 : 3000;

  io.to(roomCode).emit('check', response => {
    if (response) {
      if ((!room.players[forcedPlayer].active || timeout) && keepPlaying) {
        let username = room.players[forcedPlayer].username;
        clearTimeout(room.players[forcedPlayer].playTimer);

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

        let forcedPlayerTimer = setTimeout(() => {
          forcePlayCard(forcedPlayer, roomCode, total, reverse, true, true);
        }, timerDelay + 16200);

        room.players[forcedPlayer].playTimer = forcedPlayerTimer;

        keepPlaying = !gameOver;

        setTimeout(() => {
          forcePlayCard(forcedPlayer, roomCode, total, reverse, false, keepPlaying);

          if (newRound) {
            room.players.forEach(player => clearTimeout(player.playTimer));

            room.players.forEach((player, i) => {
              io.to(player.socket).emit('newRound', formattedPlayers.playerObjects, i, username, formattedPlayers.strikes, player.hand);
            })
          } else if (keepPlaying) {
            room.players.forEach((player, i) => {
              io.to(player.socket).emit('nextTurn', formattedPlayers.playerObjects, i, total, cardObj, reverseChange);
            })

          } else {
            room.players.forEach((player, i) => {
              clearTimeout(player.playTimer);
              io.to(player.socket).emit('gameOver', formattedPlayers.playerObjects, i);
            })
          }
        }, timerDelay);
      }
    } else {
      console.log('clear timeouts');
      room.players.forEach(player => {
        clearTimeout(player.playTimer)
      });
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
      io.to(socket.id).emit('players', players.playerObjects, 0, false, players.hand);
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

  socket.on('softEnter', (roomCode, playerId, hasPassword) => {
    console.log('softEnter player: ', playerId);
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
      io.to(socket.id).emit('enterCheck', 'OK', true);
    } else if (room.players) {
      if (!hasPassword) {
        hasPassword = room.players.some(player => player.playerId === playerId);
      }

      if (hasPassword) {
        let players = Utils.formatPlayers(Rooms.addOrFindPlayer(roomCode, playerId, socket.id), playerId);
        socket.join(roomCode);

        let owner = room.players[0].socket === socket.id;

        io.to(socket.id).emit('enterCheck', 'OK', owner, players.username !== 'Waiting...' ? players.hand : undefined, players.username);

        room.players.forEach((player, i) => {
          io.to(player.socket).emit('playerEnter', players.playerObjects, i);
        })

        //io.to(socket.id).emit('hand', players.hand);

        let activePlayers = room.players.filter(player => player.playerId !== playerId && player.active);
        activePlayers.push({ socket: socket.id });
        io.to(activePlayers[0].socket).emit('getGameState', players.index);
      } else {
        io.to(socket.id).emit('getPassword');
      }
    }
  })

  socket.on('enter', (roomCode, playerId) => {
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
      io.to(socket.id).emit('enterCheck', 'OK', true);

    } else if (room.players) {

      let players = Utils.formatPlayers(Rooms.addOrFindPlayer(roomCode, playerId, socket.id), playerId);

      if (players) {
        socket.join(roomCode);

        let owner = room.players[0].socket === socket.id;

        io.to(socket.id).emit('enterCheck', 'OK', owner, players.username !== 'Waiting...' ? players.hand : undefined, players.username);

        room.players.forEach((player, i) => {
          io.to(player.socket).emit('playerEnter', players.playerObjects, i);
        })

        //io.to(socket.id).emit('hand', players.hand);

        let activePlayers = room.players.filter(player => player.playerId !== playerId && player.active);
        activePlayers.push({ socket: socket.id });
        io.to(activePlayers[0].socket).emit('getGameState', players.index);

      } else {
        io.to(socket.id).emit('enterCheck', 'That room is full.');
      }
    }

  });

  socket.on('reenter', (playerId, roomCode) => {
    let empty = {};
    let room = Rooms.data[roomCode] || empty;
    let players = {};
    let reenter = '';
    if (room === empty) {
      reenter = 'That room does not exist.'
    } else if (room.password === password) {

      players = Utils.formatPlayers(Rooms.addOrFindPlayer(roomCode, playerId, socket.id), playerId);
      username = players.username;

      if (players) {
        socket.join(roomCode);
        reenter = 'reenter';
        room.players.forEach((player, i) => {
          io.to(player.socket).emit('playerReenter', players.playerObjects, i);
        })
      } else if (room.inRoom >= room.limit) {
        reenter = 'That room is full.'
      }
      if (reenter === 'reenter') {
        let activePlayers = room.players.filter(player => player.playerId !== playerId && player.active);
        activePlayers.push({ socket: socket.id });
        io.to(activePlayers[0].socket).emit('getGameState', players.index);
      }

    } else {
      reenter = 'Incorrect password.'
    }
    io.to(socket.id).emit('reenterCheck', reenter, username, socket.id, players.hand);

  });

  socket.on('disconnect', (roomCode, index) => {
    if (roomCode) {
      socket.leave(roomCode);
      let room = Rooms.data[roomCode] || {};
      if (room.players && index > -1) {
        room.players[index].active = false;
      }
    }
    console.log('disconnected: ', socket.id)
  })

  socket.on('currentGameState', (roomCode, countdown, played, total, index) => {
    let room = Rooms.data[roomCode] || {};
    let socketId = room.players[index].socket;

    io.to(socketId).emit('gotGameState', countdown, played, total, room.reverse);
  })

  socket.on('username', (roomCode, username, playerId) => {
    let room = Rooms.data[roomCode] || {};

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
    room.reverse = reverse;
    io.to(socket.id).emit('playerId', playerId);

    room.players && room.players.forEach(player => {
      clearTimeout(player.playTimer)
    });

    let players = Utils.formatPlayers(Rooms.playCard(roomCode, cardObj, currentPlayer, nextPlayer), playerId);
    let nextPlayerTimer = setTimeout(() => {
      forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, true);
    }, 16200);

    room.players[nextPlayer].playTimer = nextPlayerTimer;

    room.players.forEach((player, i) => {
      socket.to(player.socket).emit('nextTurn', players.playerObjects, i, syncTotal, cardObj, reverse);
    })
    // console.log('******************************')
    // console.log('socket.id: ', socket.id);
    // console.log('playerId: ', playerId);
    // console.log('players hand: ', players.hand);

    io.to(socket.id).emit('hand', players.hand);

    if (room.players[nextPlayer].active) {
      io.to(room.players[nextPlayer].socket).emit('check', (response) => {
        if (!response) {
          room.players[nextPlayer].active = false;
          forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, false);
        }
      });
    } else {
      console.log('Force play on: ', nextPlayer);
      forcePlayCard(nextPlayer, roomCode, syncTotal, reverse, false);
    }
  })

  socket.on('newRound', (roomCode, currentPlayer, nextPlayer, playerId, reverse) => {
    let room = Rooms.data[roomCode] || {};

    let { players, newRound } = Rooms.newRound(roomCode, currentPlayer, nextPlayer);
    players = Utils.formatPlayers(players, playerId);

    if (newRound) {

      room.players.forEach((player, i) => {
        clearTimeout(player.playTimer)

        io.to(player.socket).emit('newRound', players.playerObjects, i, room.players[currentPlayer].username, room.players[currentPlayer].strikes, player.hand);
      })

      let nextPlayerTimer = setTimeout(() => {
        room.players[nextPlayer].active = false;
        forcePlayCard(nextPlayer, roomCode, 0, reverse, true);
      }, 18200);

      room.players[nextPlayer].playTimer = nextPlayerTimer;

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
      room.players.forEach((player, i) => {
        clearTimeout(player.playTimer);
        io.to(player.socket).emit('gameOver', players.playerObjects, i);
      });
    }

  })

  socket.on('getHand', (roomCode, playerId) => {
    let room = Rooms.data[roomCode] || {};
    let player = room.players.filter(player => player.playerId === playerId);

    io.to(socket.id).emit('hand', player.hand);
  })

  socket.on('endGame', (roomCode, playerId) => {
    let room = Rooms.data[roomCode] || {};
    if (room.players) {
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
    // let { roomCode, owner, playerIndex, playersRemain, players } = data;

    // socket.leave(roomCode);
    // let room = Rooms.data[roomCode];

    // if (owner) {
    //   if (playersRemain) {
    //     console.log('disconnection');
    //     console.log(JSON.stringify(players));
    //     let newOwnerId = Rooms.assignNewOwner(room, playerIndex, players[0].index);
    //     let players = Utils.formatPlayers(room.players);

    //     io.to(roomCode).emit('players', players.playerObjects);
    //     io.to(newOwnerId).emit('owner');
    //   } else {
    //     Rooms.deleteRoom(roomCode);
    //   }
    // } else {
    //   room.players[playerIndex].active = false;
    //   let players = Utils.formatPlayers(room.players);

    //   io.to(roomCode).emit('players', players.playerObjects);
    //   console.log('player left. active is set to: ', room.players[playerIndex].active);
    // }
  });

})

app.use(cors());
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
  console.log(`Listening on port ${port}`)
});