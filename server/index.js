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

const port = process.env.PORT || 99;
const path = require('path')

io.on('connection', (socket) => {
  socket.on('enter', (roomCode, username, limit) => {
    //{ roomCode, username, limit }
    console.log('entered')
    socket.join(roomCode);
    if (roomCode in Rooms) {
      console.log('exists');
      let players = Rooms.addPlayer(roomCode, username);

      players = players.reduce((accum, player) => {
        accum.usernames.push(player.username);
        if (player.username === username) {
          accum.hand = player.hand;
        }
        return accum;
      }, { usernames: [], hand: [] });

      io.to(roomCode).emit('players', players);
    } else {
      console.log('new');
      let deck = shuffleDeck(createDeck());
      let room = Rooms.create(roomCode, username, limit, deck);
      console.log(room.players);

      console.log(room.players[0].hand);

      let players = room.players.reduce((accum, player) => {
        accum.usernames.push(player.username);
        if (player.username === username) {
          accum.hand = player.hand;
        }
        return accum;
      }, { usernames: [], hand: [] });

      io.to(roomCode).emit('players', players);
    }
  })
  socket.on('sendMessage', message => {

  })
  socket.on('disconnect', (roomCode, owner) => {
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