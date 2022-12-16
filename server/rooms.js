module.exports = {
  rooms: {},
  create: function (room, limit) {
    if (!(room in this.rooms)) {
      this.rooms[room] = { limit };
    }
    return this.rooms[room];
  },
  remove: function (room) {
    delete this.rooms[room];
  },
  addUser: function (room, user) {
    if (rooms[room].limit > rooms[room].users.length) {
      rooms[room].users.push({ user });
      return true;
    }
    return false;
  },
  addDeck: function (room, deck) {
    rooms['deck'] = deck;
  }
}