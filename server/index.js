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

io.on('connection', (socket) => {
  socket.on('create', (roomCode, username, limit, uid = socket.id) => {

    let room = Rooms.create(roomCode, username, limit, uid);

    let players = Utils.formatPlayers(room.players, uid);

    if (players) {
      io.to(roomCode).emit('players', players.playerObjects);
      io.to(socket.id).emit('hand', players.hand);
    }

  });

  socket.on('enter', (roomCode, uid = socket.id) => {
    socket.join(roomCode);
    if (roomCode in Rooms.data) {
      let players = Utils.formatPlayers(Rooms.addPlayer(roomCode, uid), uid);

      if (players) {
        io.to(roomCode).emit('players', players.playerObjects);
        io.to(socket.id).emit('uid', socket.id);
      }

    }
  });

  socket.on('username', (roomCode, username, uid = socket.id) => {
    if (roomCode in Rooms.data) {
      let players = Utils.formatPlayers(Rooms.addPlayer(roomCode, uid, username), uid);

      if (players) {
        io.to(roomCode).emit('players', players.playerObjects);
        io.to(socket.id).emit('hand', players.hand);
      }
    }
  });

  socket.on('playCard', (cardObj, roomCode, uid) => {
    let room = Rooms.data[roomCode];

    let newRound = Utils.playCard(cardObj, room, uid);
    let players = Utils.formatPlayers(room.players, uid);

    if (newRound) {
      io.to(roomCode).emit('newRound', players.playerObjects, players.username, players.strikes);

      room.players.forEach(player => {
        io.to(player.id).emit('hand', player.hand);
      })

    } else {
      io.to(roomCode).emit('nextTurn', players.playerObjects, room.total, cardObj);
      io.to(socket.id).emit('hand', players.hand);
    }
  })

  socket.on('sendMessage', (message) => {

  });

  socket.on('disconnection', (roomCode, owner) => {
    socket.leave(roomCode);
    if (owner) {
      Rooms.remove(roomCode);
    }
  });

})

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
  res.sendStatus(200);
  console.log('entered');
})

app.get('/:roomCode', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`)
});