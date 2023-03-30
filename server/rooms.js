const { dealCards } = require('./utils.js');

const Rooms = {
  data: {},
  create: function (roomCode, username, limit, uid) {
    let players = [];
    for (let i = 0; i < limit; i++) {
      players[i] = {
        id: i ? undefined : uid,
        username: i ? 'Waiting...' : username,
        hand: [],
        strikes: 0,
        turn: i ? false : true
      }
    }

    let room = {
      limit,
      players,
      total: 0,
      reverse: false,
      inRoom: 1
    }

    dealCards(room);

    if (!(roomCode in this.data)) {
      this.data[roomCode] = room
    }
    return this.data[roomCode];
  },
  remove: function (roomCode) {
    delete this.data[roomCode];
  },
  addPlayer: function (roomCode, uid, username = 'Waiting...') {
    let room = this.data[roomCode];
    let openings = room.players.reduce((accum, player, i) => {
      if ((!player.id || player.id === uid) && !accum.found) {
        accum.found = true;
        accum.index = Math.max(accum.index, i);
      }
      return accum;
    }, { found: false, index: 1 });

    if (openings.found) {
      room.players[openings.index].id = uid;
      room.players[openings.index].username = username;
      room.inRoom += 1;
      return room.players;
    }
    return false;
  }
}

module.exports = Rooms;