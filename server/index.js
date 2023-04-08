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

function forcePlayCard(nextPlayer, roomCode, syncTotal, reverse) {
  let room = Rooms.data[roomCode];
  let keepPlaying = true;

  while (!room.players[nextPlayer].active && keepPlaying) {
    let username = room.players[nextPlayer].username;
    clearTimeout(room.players[nextPlayer].playTimer);

    let { total,
          cardObj,
          reverseChange,
          newPlayer,
          newRound,
          players,
          gameOver } = Rooms.forcePlay(nextPlayer, roomCode, syncTotal, reverse);

    let formattedPlayers = Utils.formatPlayers(players, room.players[nextPlayer].id);

    nextPlayer = newPlayer;
    if (room.players[nextPlayer].active) {
      io.to(room.players[nextPlayer].id).emit('check', (response) => {
        if (!response) {
          room.players[nextPlayer].active = false;
        }
      });
    }

    let nextPlayerTimer = setTimeout(() => {
      room.players[nextPlayer].active = false;
      forcePlayCard(nextPlayer, roomCode, syncTotal, reverse);
    }, 17000);

    room.players[nextPlayer].playTimer = nextPlayerTimer;

    keepPlaying = !gameOver;

    setTimeout(() => {
      if (newRound) {
        room.players.forEach(player => clearTimeout(player.playTimer));

        io.to(roomCode).emit('newRound', formattedPlayers.playerObjects, username, formattedPlayers.strikes);

        room.players.forEach(player => {
          io.to(player.id).emit('hand', player.hand);
        })
      } else if (keepPlaying) {
        io.to(roomCode).emit('nextTurn', formattedPlayers.playerObjects, total, cardObj, reverseChange);

      } else {
        room.players.forEach(player => clearTimeout(player.playTimer));
        io.to(roomCode).emit('gameOver', formattedPlayers.playerObjects);
      }
    }, 2000);
  }
}

io.on('connection', (socket) => {

  socket.on('getRoomCode', () => {
    let roomCode = Rooms.generateRoomCode('');

    io.to(socket.id).emit('roomCode', roomCode);
  });

  socket.on('deleteRoomCode', (roomCode) => {
    Rooms.deleteRoom(roomCode);
  });

  socket.on('roomCheck', (roomCode, password) => {
    let room = Rooms.data[roomCode] || {};

    io.to(socket.id).emit('roomResult', room.password === password, room.password, roomCode);
  });

  socket.on('create', (roomCode, password, username, limit, uid = socket.id) => {
    console.log('joined at create')
    socket.join(roomCode);

    let room = Rooms.create(roomCode, password, username, limit, uid);

    let players = Utils.formatPlayers(room.players, uid);

    if (players) {
      io.to(roomCode).emit('players', players.playerObjects, uid);
      io.to(socket.id).emit('hand', players.hand);
    }

  });

  socket.on('enter', (roomCode, uid = socket.id) => {
    let room = Rooms.data[roomCode] || {};

    if (room.players) {
      console.log('joined at enter')
      socket.join(roomCode);
      console.log(room.players);
      let players = Utils.formatPlayers(Rooms.addPlayer(roomCode, uid), uid);
      console.log(players.playerObjects);
      if (players) {

        io.to(roomCode).emit('players', players.playerObjects);
        io.to(socket.id).emit('playerId', socket.id);
      } else {
        io.to(socket.id).emit('enterFail', 'That room is full.');
      }
    } else if (room.password !== password) {
      io.to(socket.id).emit('enterFail', 'Incorrect password');
    } else {
      io.to(socket.id).emit('enterFail', 'That room does not exist.');
    }

  });

  socket.on('reenter', (uid, password, roomCode) => {
    let empty = {};
    let room = Rooms.data[roomCode] || empty;
    let players = {};
    let reenter = '';
    let username = '';

    if (room === empty) {
      reenter = 'That room does not exist.'
    } else if (room.password === password) {
      players = Utils.formatPlayers(Rooms.findPlayer(roomCode, uid, socket.id), socket.id);

      username = players.username;

      if (players) {
        console.log('joined at reenter')
        socket.join(roomCode);
        reenter = 'reenter';
        io.to(roomCode).emit('playerReenter', players.playerObjects);
      } else if (room.inRoom === room.limit) {
        reenter = 'That room is full.'
      }
      if (reenter === 'reenter') {
        console.log('countdown requested')
        let activePlayers = room.players.filter(player => player.id !== socket.id && player.active);
        console.log('requested from: ', activePlayers[0].id);
        io.to(activePlayers[0].id).emit('getCountdown', players.index);
      }

    } else {
      reenter = 'Incorrect password.'
    }
    console.log('reenter: ', reenter);
    console.log('username: ', username);
    console.log('password match: ', room.password === password);
    console.log('reenterCheck: ', socket.id);
    io.to(socket.id).emit('reenterCheck', reenter, username, socket.id, players.hand);

  });

  socket.on('disconnect', () => {
    console.log('ran')
  })

  socket.on('currentCountdown', (roomCode, countdown, index) => {
    console.log('countdown received: ', countdown)
    let socketId = Rooms.data[roomCode].players[index].id;
    console.log('sending countdown: ', socketId)
    io.to(socketId).emit('gotCountdown', countdown);
  })

  socket.on('username', (roomCode, username, uid = socket.id) => {
    if (roomCode in Rooms.data) {
      let players = Utils.formatPlayers(Rooms.addPlayer(roomCode, uid, username), uid);

      if (players) {
        io.to(roomCode).emit('players', players.playerObjects);
        io.to(socket.id).emit('hand', players.hand);
      }
    }
  });

  socket.on('playCard', (cardObj, roomCode, reverse, syncTotal, currentPlayer, nextPlayer, uid = socket.id) => {
    let room = Rooms.data[roomCode];
    clearTimeout(room.players[currentPlayer].playTimer);

    let players = Utils.formatPlayers(Rooms.playCard(roomCode, cardObj, currentPlayer, nextPlayer), uid);
    let nextPlayerTimer = setTimeout(() => {
      room.players[nextPlayer].active = false;
      forcePlayCard(nextPlayer, roomCode, syncTotal, reverse);
    }, 17000);

    room.players[nextPlayer].playTimer = nextPlayerTimer;

    socket.to(roomCode).emit('nextTurn', players.playerObjects, syncTotal, cardObj, reverse);
    io.to(socket.id).emit('hand', players.hand);

    if (room.players[nextPlayer].active) {
      io.to(room.players[nextPlayer].id).emit('check', (response) => {
        if (!response) {
          room.players[nextPlayer].active = false;
          forcePlayCard(nextPlayer, roomCode, syncTotal, reverse);
        }
      });
    } else {
      forcePlayCard(nextPlayer, roomCode, syncTotal, reverse);
    }

  })

  socket.on('newRound', (roomCode, currentPlayer, nextPlayer, uid) => {
    let room = Rooms.data[roomCode];

    let { players, newRound } = Rooms.newRound(roomCode, currentPlayer, nextPlayer);
    players = Utils.formatPlayers(players, uid);

    if (newRound) {

      io.to(roomCode).emit('newRound', players.playerObjects, room.players[currentPlayer].username, room.players[currentPlayer].strikes);

      room.players.forEach(player => {
        clearTimeout(player.playTimer)
        io.to(player.id).emit('hand', player.hand);
      })
    } else {
      room.players.forEach(player => clearTimeout(player.playTimer));
      io.to(roomCode).emit('gameOver', players.playerObjects);
    }

  })

  socket.on('getHand', (roomCode, index) => {
    io.to(socket.id).emit('hand', Rooms.data[roomCode].players[index].hand);
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

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`)
});