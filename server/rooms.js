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
  addPlayer: function (roomCode, username = 'Waiting...') {
    let openings = this.rooms[roomCode].players.reduce((accum, player, i) => {
      if (player.username === 'Waiting...' && !accum.found) {
        accum.found = true;
        accum.index = Math.max(accum.index, i);
      }
      return accum;
    }, { found: false, index: 1 });

    if (openings.found) {
      this.rooms[roomCode].players[openings.index].username = username;
      this.rooms[roomCode].inRoom += 1;
      return this.rooms[roomCode].players;
    }
    return false;
  }
}