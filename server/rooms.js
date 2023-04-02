const { dealCards } = require('./utils.js');
const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const Rooms = {
  data: {DAM: '',
         COC: '',
         COK: '',
         DIC: '',
         DIK: '',
         FUC: '',
         PUC: '',
         PUK: '',
         SUC: '',
         SUK: '',
         SLU: '',
         SHI: '',
         CUN: '',
         FAG: '',
         HOMO: '',
         POR: '',
         VAG: '',
         PUS: '',
         HOR: '',
         WHR: '',
         ASS: '',
         ASH: '',
         GOD: '',
         BAL: '',
         BUT: ''},
  generateRoomCode: function (str) {
      if (str in this.data || str.slice(1) in this.data) {
        return this.generateRoomCode(allLetters[Math.floor(Math.random() * 26)]);
      } else if (str.length === 4) {
        this.data[str] = { players: false };
        return str;
      }
      return this.generateRoomCode(str + allLetters[Math.floor(Math.random() * 26)]);
  },
  create: function (roomCode, password, username, limit, uid) {
    let players = [];
    for (let i = 0; i < limit; i++) {
      players[i] = {
        id: i ? undefined : uid,
        username: i ? 'Waiting...' : username,
        hand: [],
        strikes: 0,
        turn: i ? false : true,
        index: i
      }
    }

    let timeoutId = this.timedDeleteRoom(roomCode);

    let room = {
      limit,
      players,
      total: 0,
      reverse: false,
      inRoom: 1,
      timeoutId
    }

    if (password) {
      room.password = password;
    }

    dealCards(room);

    this.data[roomCode] = room

    return this.data[roomCode];
  },
  deleteRoom: function (roomCode) {
    delete this.data[roomCode];
  },
  timedDeleteRoom: function (roomCode) {
    return setTimeout(() => this.deleteRoom(roomCode), (60000 * 60));
  },
  restartGame: function (timeoutId, roomCode) {
    clearTimeout(timeoutId);
    return this.timedDeleteRoom(roomCode);
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
  },
  playCard: function(roomCode, cardObj, currentPlayer, nextPlayer) {
    let room = this.data[roomCode];

    this.updateTurns(room, currentPlayer, nextPlayer);

    let filteredHand = room.players[currentPlayer].hand.filter(inHand => inHand[0] !== cardObj[0]);
    room.players[currentPlayer].hand =[...filteredHand, room.deck.shift()];

    return room.players;
  },
  newRound: function(roomCode, currentPlayer, nextPlayer) {
    let room = this.data[roomCode];

    this.updateTurns(room, currentPlayer, nextPlayer);

    room.players[currentPlayer].strikes += 1;

    let strikes = 0;

    room.players.forEach((player) => {
      if (player.strikes === 3) {
        strikes += 1;
      }
      player.hand = [];
    })

    if (strikes === (room.limit - 1)) {
      return { players: room.players, newRound: false };
    } else {
      dealCards(room);
    }

    return { players: room.players, newRound: true };
  },
  updateTurns: function(room, currentPlayer, nextPlayer) {
    room.players[nextPlayer].turn = true;
    room.players[currentPlayer].turn = false;
  }
}

module.exports = Rooms;