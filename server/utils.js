const { shuffleDeck, createDeck } = require('../client/src/helperFiles/deck.js');;

function formatPlayers(players, currentPlayerId, showHands = false) {

  return players ?
    players.reduce((accum, player, i) => {
      let { playerId, username, strikes, turn, index, active, hand } = player;
      accum.playerObjects.push({ username, strikes, turn, index, active, hand: showHands ? hand : [] });

      if (playerId === currentPlayerId) {
        accum.hand = hand;
        accum.username = username;
        accum.strikes = strikes;
        accum.index = i;
      }
      return accum;
    }, { playerObjects: [], hand: [], username: '', strikes: 0, index: 0}) :
    players;
}

function playCard(cardObj, room, playerId) {
  let newRound = false;

  if (cardObj[0][0] === '4') {
    room.reverse = !room.reverse;

  } else if (cardObj[0][0] === 'K') {
    room.total = 99;

  } else {
    if (room.total + cardObj[1] > 99) {
      gameOver(room, playerId);
      newRound = true;
      return newRound;
    } else {
      room.total = room.total += cardObj[1];
    }

  }

  if (!newRound) {
    updatePlayers(cardObj, room, playerId);

    if (!room.deck.length) {
      room.deck = shuffleDeck(room.discard);
      room.discard = [cardObj];
    } else {
      room.discard.push(cardObj);
    }

    return newRound;
  }
}

function gameOver(room, playerId) {
  updatePlayers(false, room, playerId);
  newDeal(room);
}

function newDeal(room) {
  room.players.forEach(player => {
    player.hand = [];
  });

  dealCards(room);
}

function dealCards(room) {
  room.deck = shuffleDeck(createDeck());
  room.discard = [];

  let deals = 3;

  while (deals) {
    room.players.forEach(player => {
      if (player.strikes < 3) {
        player.hand.push(room.deck.shift());
      }
    })
    deals--;
  }
}

function updatePlayers(cardObj, room, playerId) {
  for (let i = 0; i < room.players.length; i++) {

    if (room.players[i].playerId === playerId) {
      room.players[i].turn = false;
      setNextPlayer(room, i);
      if (cardObj) {
        drawCard(cardObj, room, i);
      } else {
        room.players[i].strikes += 1;
      }

      break;
    }
  }
}

function setNextPlayer(room, i) {
  let setNextPlayer = false;
  let change = room.reverse ? -1 : 1;
  let j = setIndex(i, change, room);

  while (!setNextPlayer) {
    if (room.players[j].strikes < 3) {
      room.players[j].turn = true;
      setNextPlayer = true;
    } else {
      j = setIndex(j, change, room);
    }
  }
}

function drawCard(cardObj, room, i) {
  let filteredHand = room.players[i].hand.filter(inHand => inHand[0] !== cardObj[0]);
  room.players[i].hand =[...filteredHand, room.deck.shift()];
}

function setIndex(j, change, room) {
  j = j + change;
  if (room.reverse && j < 0) {
    j = room.players.length - 1;
  } else if (!room.reverse && j === room.players.length) {
    j = 0;
  }
  return j;
}


module.exports = {
  formatPlayers,
  playCard,
  gameOver,
  dealCards,
  updatePlayers,
  setNextPlayer,
  drawCard,
  setIndex
}