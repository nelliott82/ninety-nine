const express = require('express');
const app = express();
const http = require('http').createServer(app)
const cors = require('cors');
const io = require('socket.io')(http)

const Rooms = require('./rooms');

const port = process.env.PORT || 99;
const path = require('path')

io.on('connection', (socket) => {
  socket.on("enter", () => {
    console.log('entered');
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})