const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
//const http = require('http').createServer(app);
const cors = require('cors');
const { shuffleDeck, createDeck } = require('../client/src/helperFiles/deck.js');
const httpServer = createServer(app);
const io = new Server(httpServer);

const Rooms = require('./rooms');
const Utils = require('./utils');

const port = process.env.PORT || 99;
const path = require('path')

io.on('connection', (socket) => {
  socket.on('enter', (roomCode, username, limit) => {

    console.log('entered')
    socket.join(roomCode);
    if (roomCode in Rooms.rooms) {
      console.log('exists');
      let players = Utils.sortPlayers(Rooms.addPlayer(roomCode, username), username);

      players && io.to(roomCode).emit('players', players);
    } else {
      console.log('new');
      let deck = shuffleDeck(createDeck());
      let room = Rooms.create(roomCode, username, limit, deck);

      let players = Utils.sortPlayers(room.players, username);

      io.to(roomCode).emit('players', players);
    }
  })
  socket.on('sendMessage', message => {

  })
  socket.on('disconnection', (roomCode, owner) => {
    socket.leave(roomCode);
    if (owner) {
      Rooms.remove(roomCode);
    }
  })
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