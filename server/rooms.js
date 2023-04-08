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
         FIST: '',
         NIG: '',
         NGU: '',
         NGA: '',
         NGGR: '',
         NGER: '',
         SPIC: '',
         HOMO: '',
         POR: '',
         VAG: '',
         PUS: '',
         HOR: '',
         WHR: '',
         ASS: '',
         ANAL: '',
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
        owner: i ? false : true,
        username: i ? 'Waiting...' : username,
        hand: [],
        strikes: 0,
        turn: i ? false : true,
        active: i ? false : true,
        playTimer: null,
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
  deleteRoom: function (roomCode, byTimer) {
    if (!byTimer) {
      clearTimeout(this.data[roomCode].timerId);
    }
    delete this.data[roomCode];
  },
  timedDeleteRoom: function (roomCode) {
    return setTimeout(() => this.deleteRoom(roomCode, true), (60000 * 60));
  },
  restartGame: function (timeoutId, roomCode) {
    clearTimeout(timeoutId);
    return this.timedDeleteRoom(roomCode);
  },
  addPlayer: function (roomCode, uid, username = 'Waiting...') {
    let room = this.data[roomCode];
    let openings = room.players.reduce((accum, player, i) => {
      console.log('player.id: ', player.id);
      console.log('uid: ', uid);
      if ((!player.id || player.id === uid) && !accum.found) {
        accum.found = true;
        accum.index = Math.max(accum.index, i);
      }
      return accum;
    }, { found: false, index: 1 });
    console.log('openings: ', openings);
    if (openings.found) {
      room.players[openings.index].id = uid;
      room.players[openings.index].username = username;
      room.players[openings.index].active = true;
      room.inRoom += 1;
      return room.players;
    }
    return false;
  },
  findPlayer: function (roomCode, oldUid, newUid) {
    let room = this.data[roomCode];
    let openings = room.players.reduce((accum, player, i) => {
      if ((player.id === oldUid) && !accum.found) {
        accum.found = true;
        accum.index = Math.max(accum.index, i);
      }
      return accum;
    }, { found: false, index: 1 });

    if (openings.found) {
      room.players[openings.index].id = newUid;
      room.players[openings.index].active = true;
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
  forcePlay: function(currentPlayer, roomCode, syncTotal, reverse) {
    let total = syncTotal;
    let newRound = false;
    let player = this.data[roomCode].players[currentPlayer];
    let players = this.data[roomCode].players;
    let gameOver;
    let cardObj = player.hand[0];

    if (cardObj[0][0] === '4') {
      reverse = !reverse;

    } else if (cardObj[0][0] === 'K') {
      total = 99;

    } else {
      if (total + cardObj[1] > 99) {
        newRound = true;
      } else {
        total += cardObj[1];
      }
    }

    let nextPlayer = this.calculateNextPlayer(currentPlayer, roomCode, reverse);

    this.playCard(roomCode, cardObj, currentPlayer, nextPlayer);

    if (!newRound) {
      this.playCard(roomCode, cardObj, currentPlayer, nextPlayer);
    } else {
      let newRoundResults = this.newRound(roomCode, currentPlayer, nextPlayer);
      players = newRoundResults.players;
      newRound = newRoundResults.newRound;
      gameOver = !newRound;
    }

    return { total, cardObj, reverseChange: reverse, newPlayer: nextPlayer, newRound, players, gameOver };
  },
  newRound: function(roomCode, currentPlayer, nextPlayer) {
    let room = this.data[roomCode];

    this.updateTurns(room, currentPlayer, nextPlayer);

    room.players[currentPlayer].strikes += 1;

    let strikes = 0;
    let active = 0;

    room.players.forEach((player) => {
      if (player.strikes === 3) {
        strikes += 1;
      }
      if (!player.active) {
        active += 1;
      }
      player.hand = [];
    })

    if (strikes === (room.limit - 1) || active === (room.limit - 1)) {
      return { players: room.players, newRound: false };
    } else {
      dealCards(room);
    }

    return { players: room.players, newRound: true };
  },
  updateTurns: function(room, currentPlayer, nextPlayer) {
    room.players[nextPlayer].turn = true;
    room.players[currentPlayer].turn = false;
  },
  assignNewOwner: function(room, oldOwnerIndex, newOwnerIndex) {
    room.players[oldOwnerIndex].active = false;
    room.players[oldOwnerIndex].owner = false;
    room.players[newOwnerIndex].owner = true;

    return room.players[newOwnerIndex].id;
  },
  setIndex: function(j, change, roomCode) {
    j = j + change;
    if (j < 0) {
      j = this.data[roomCode].players.length - 1;
    } else if (j === this.data[roomCode].players.length) {
      j = 0;
    }
    return j;
  },
  calculateNextPlayer: function(index, roomCode, reverse) {
    let setNextPlayer = false;
    let change = reverse ? -1 : 1;
    let j = this.setIndex(index, change, roomCode);

    while (!setNextPlayer) {
      if (this.data[roomCode].players[j].strikes < 3) {
        setNextPlayer = true;
      } else {
        j = this.setIndex(j, change, roomCode);
      }
    }

    return this.data[roomCode].players[j].index;

    // setTurn(turn => nextPlayer);

    // if (nextPlayer !== 0) {
    //   computer(nextPlayer);
    // }
  }
}

module.exports = Rooms;