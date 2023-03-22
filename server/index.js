const express = require('express');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
//const http = require('http').createServer(app);
const cors = require('cors');
const { shuffleDeck, createDeck } = require('../client/src/helperFiles/deck.js');
const httpServer = createServer(app);
const io = new Server(httpServer);

const Rooms = require('./rooms');

const port = process.env.PORT || 99;
const path = require('path')

io.on("connection", (socket) => {
  socket.on("enter", (roomCode, username, limit) => {
    //{ roomCode, username, limit }
    console.log('entered')
    if (roomCode in Rooms) {
      console.log('exists');
      Rooms.addPlayer(roomCode, username);

    } else {
      console.log('roomCode: ', roomCode);
      console.log('username: ', username);
      console.log('limit: ', limit);
      console.log('new');
      let deck = shuffleDeck(createDeck());
      let room = Rooms.create(roomCode, username, limit, deck);
      console.log(room.players);

      console.log(room.players[0].hand);
    }
  })
  socket.on("sendMessage", message => {

  })
  socket.on("disconnect", () => {

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