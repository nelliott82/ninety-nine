const { dealCards } = require('./utils.js');
const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const Rooms = {
  data: {DAM: '',
         COC: '',
         COK: '',
         DIC: '',
         DIK: '',
         FUC: '',
         FUK: '',
         PUC: '',
         PUK: '',
         SUC: '',
         SUK: '',
         SLU: '',
         SHI: '',
         CUN: '',
         FAG: '',
         NIG: '',
         NGU: '',
         NGA: '',
         NGGR: '',
         NGER: '',
         SPIC: '',
         HOMO: '',
         TRN: '',
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
         BUT: '',
         KKK: ''},
  generateRoomCode: function (str) {
      if (str in this.data || str.slice(1) in this.data) {
        return this.generateRoomCode(allLetters[Math.floor(Math.random() * 26)]);
      } else if (str.length === 4) {
        this.data[str] = { players: false };
        return str;
      }
      return this.generateRoomCode(str + allLetters[Math.floor(Math.random() * 26)]);
  },
  create: function (roomCode, password, username, limit, playerId, socket) {
    let players = [];

    for (let i = 0; i < limit; i++) {
      players[i] = {
        playerId: i ? undefined : playerId,
        owner: i ? false : true,
        username: i ? 'Waiting...' : username,
        hand: [],
        strikes: 0,
        turn: i ? false : true,
        active: i ? false : true,
        socket: i ? undefined : socket,
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
      timeoutId,
      playTimer: null,
      created: true
    }

    if (password) {
      room.password = password;
    }

    dealCards(room);

    this.data[roomCode] = room

    return this.data[roomCode];
  },
  deleteRoom: function (roomCode) {
    let room = this.data[roomCode] || { timerId: null }
    clearTimeout(room.timerId);
    clearTimeout(room.playTimer);
    delete this.data[roomCode];
  },
  timedDeleteRoom: function (roomCode) {
    return setTimeout(() => this.deleteRoom(roomCode, true), (60000 * 60));
  },
  restartGame: function (timeoutId, roomCode) {
    clearTimeout(timeoutId);
    return this.timedDeleteRoom(roomCode);
  },
  addOrFindPlayer: function (roomCode, playerId, socket, username) {
    let room = this.data[roomCode] || { players: [] };
    let openings = room.players.reduce((accum, player, i) => {
      if ((!player.playerId || player.playerId === playerId) && !accum.found) {
        accum.found = true;
        accum.index = Math.max(accum.index, i);
      }
      return accum;
    }, { found: false, index: 0 });

    if (openings.index === room.players.length - 1) {
      room.full = true;
    }

    if (openings.found) {
      room.players[openings.index].playerId = playerId;
      room.players[openings.index].username = username ? username : room.players[openings.index].username;
      room.players[openings.index].active = true;
      room.players[openings.index].socket = socket;
      return room.players;
    }
    return false;
  },
  playCard: function(roomCode, cardObj, currentPlayer, nextPlayer, forced) {
    let room = this.data[roomCode];

    this.updateTurns(room, currentPlayer, nextPlayer);

    let filteredHand = room.players[currentPlayer].hand.filter(inHand => {
      if (inHand) {
        return inHand[0] !== cardObj[0]
      }
    });
    room.players[currentPlayer].hand =[...filteredHand, room.deck.shift()];

    // Every now and then, due to conflict in timers, the player's hand would be more than 3.
    // This can cause the client to see more than 3 hands, attempt to play one, and break something.
    // Many attempts to correct this behavior have been made, but on the off chance an edge
    // case wasn't considered, this will solve for it.
    let handLength = room.players[currentPlayer].hand.length
    if (handLength > 3) {
      room.players[currentPlayer].hand = room.players[currentPlayer].hand.slice(handLength - 3);
    }

    return room.players;
  },
  forcePlay: function(forcedPlayer, roomCode, syncTotal, reverse) {
    let room = this.data[roomCode] || {};
    let total = syncTotal;
    let newRound = false;
    let player = room.players[forcedPlayer];
    let players = room.players;
    let gameOver;
    let cardObj = player.hand[0];

    if (cardObj[0][0] === '4') {
      room.reverse = !reverse;

    } else if (cardObj[0][0] === 'K') {
      total = 99;

    } else {
      if (total + cardObj[1] > 99) {
        newRound = true;
      } else {
        total += cardObj[1];
      }
    }

    let nextPlayer = this.calculateNextPlayer(forcedPlayer, roomCode, room.reverse);

    if (!newRound) {
      this.playCard(roomCode, cardObj, forcedPlayer, nextPlayer, true);
    } else {
      let newRoundResults = this.newRound(roomCode, forcedPlayer, nextPlayer);
      players = newRoundResults.players;
      newRound = newRoundResults.newRound;
      gameOver = !newRound;
    }

    return { total, cardObj, reverseChange: room.reverse, newPlayer: nextPlayer, newRound, players, gameOver };
  },
  replay: function(roomCode) {
    let room = this.data[roomCode];
    room.players.forEach(player => {
      player.strikes = 0;
      player.active = true;
      clearTimeout(player.playTimer);
      player.hand = [];
      player.turn = player.owner ? true : false;
    })
    dealCards(room);

    room.timeoutId = this.restartGame(room.timeoutId, roomCode);
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

    return room.players[newOwnerIndex].socket;
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