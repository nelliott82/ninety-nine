module.exports = {
  rooms: {},
  create: function (roomCode, username, limit, deck) {
    let players = [];
    for (let i = 0; i < limit; i++) {
      players[i] = {
        username: i ? 'Waiting...' : username,
        hand: [],
        strikes: 0,
        turn: i ? false : true
      }
    }

    let deals = 3;

    while (deals) {
      players.forEach(player => {
        if (player.strikes < 3) {
          player.hand.push(deck.shift());
        }
      })
      deals--;
    }

    let room = {
      limit,
      players,
      deck,
      discard: [],
      inRoom: 1
    }
    if (!(roomCode in this.rooms)) {
      this.rooms[roomCode] = room
    }
    return this.rooms[roomCode];
  },
  remove: function (roomCode) {
    delete this.rooms[roomCode];
  },
  addPlayer: function (roomCode, username) {
    let players = this.rooms[roomCode].players.reduce((accum, player, i) => {
      if (player.username === 'Waiting...') {
        accum.count += 1;
        accum.index = Math.max(accum.index, i);
      }
      return accum;
    }, { count: 0, index: 1 });

    if (!players.count) {
      this.rooms[roomCode].players[players.index].username = username;
      this.rooms[roomCode].inRoom += 1;
      return this.rooms[roomCode].players;
    }
    return false;
  }
}