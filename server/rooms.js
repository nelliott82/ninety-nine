module.exports = {
  rooms: {},
  create: function (roomCode, username, limit, deck) {
    let players = [];
    for (let i = 0; i < limit; i++) {
      players[i] = {
        username: i ? "Waiting..." : username,
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
  remove: function (room) {
    delete this.rooms[room];
  },
  addPlayer: function (roomCode, username) {
    if (rooms[roomCode].limit > rooms[roomCode].players.length) {
      rooms[roomCode].players.push(username);
      rooms[roomCode].inRoom += 1;
      return true;
    }
    return false;
  }
}