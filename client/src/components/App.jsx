import React, { useState } from 'react';
import nikkoBot from '../helperFiles/computer.js';

function shuffleDeck (deck) {
  var total = deck.length;

  while (total) {
    var randomIndex = Math.floor(Math.random() * total--);
    [deck[randomIndex], deck[total]] = [deck[total], deck[randomIndex]];
  }
  return deck;
};

function createDeck () {
  var suits = [ '♥', '♣', '♠', '♦' ];
  var values = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];
  var deck = [];

  suits.forEach(function(suit) {
    values.forEach(function(value) {
      var realValue = value;

      if (value === 'A') {
        realValue = 1;
      } else if (value === 'J' || value === 'Q') {
        realValue = 10;
      } else if (value === 'K') {
        // K realValue is 0 for sorting purposes
        realValue = 0;
      }

      deck.push([value + suit, realValue]);
    });
  });

  return deck;
}

var syncTotal = 0;

var App = () => {
  var [deck, setDeck] = useState(shuffleDeck(createDeck()));
  var [played, setPlayed] = useState([]);
  var [computerHand, setComputerHand] = useState([]);
  var [playerOneHand, setPlayerOneHand] = useState([]);
  var [started, setStarted] = useState(false);
  var [turn, setTurn] = useState(true);
  var [thinking, setThinking] = useState(false);
  var [total, setTotal] = useState(0);

  function playCard(cardObj, player) {
    var card = cardObj[0];

    if (player) {
      setTurn(false);
      setPlayerOneHand(payerOneHand => [...playerOneHand.filter(inHand => inHand[0] !== card), deck.shift()]);
    } else {
      setComputerHand(computerHand => [...computerHand.filter(inHand => inHand[0] !== card), deck.shift()]);
      setTurn(true);
    }
    // Check for four special cards
    if (card[0] === '4') {
      // Eventually reverse order of play

    } else if (card[0] + card[1] === '10') {
      setTotal(total => total - 10);
      syncTotal -= 10;

    } else if (card[0] === '9') {
      // Do nothing. 9 is hold.

    } else if (card[0] === 'K') {
      setTotal(total => 99);
      syncTotal = 99;

    // Check for Q or J
    } else if (card[0] === 'Q' || card[0] === 'J') {
      setTotal(total => total + 10);
      syncTotal += 10;

    } else if (card[0] === 'A') {
      setTotal(total => total + 1);
      syncTotal += 1;

    } else {
      setTotal(total => total + parseInt(card[0]));
      syncTotal = syncTotal + parseInt(card[0]);

    }

    setPlayed(played => [...played, cardObj]);
    if (player) {
      computer();
    }
    if (!deck.length) {
      var reUsePlayed = shuffleDeck(played);
      setDeck(deck => [...reUsePlayed]);
      setPlayed(played => []);
    }
  }

  function computer() {
    setThinking(true);
    var thinkingTime = syncTotal < 80 ? Math.random() * 3000 + 500 :Math.random() * 5000 + 1000 ;
    setTimeout(() => {
      playCard(nikkoBot.chooseCard(computerHand, syncTotal));
      setThinking(false)
    }, thinkingTime);
  }

  function startGame() {
    setPlayerOneHand([deck[0], deck[2], deck[4]]);
    setComputerHand([deck[1], deck[3], deck[5]]);
    var deals = 6;
    while (deals) {
      deck.shift();
      deals--;
    }
    setStarted(true);
  }

  return (
    <>
    {deck.length ? <div>
      {deck.map(card => <span key={card[0]} >{card[0]}</span>)}
    </div> : null}
    &nbsp;
    &nbsp;
    {played.length ? <div>
      {played.map(card => <span key={card[0]} >{card[0]}</span>)}
    </div> : null}
    &nbsp;
    &nbsp;
    <div>
    {started ? <span>Game Total: {total}</span> : <button onClick={startGame}>Start Game</button>}
    </div>
    &nbsp;
    &nbsp;
    <div>
      <div>Player One:</div>
      {playerOneHand.length ?
      playerOneHand.map(card => <span onClick={() => {if (turn) {playCard(card, true)}}} key={card[0] + 'p'} >{card[0]}</span>)
      : null}
    </div>
    &nbsp;
    &nbsp;
    <div>
      <div>Computer:</div>
      {computerHand.length ? computerHand.map(card => <span key={card[0] + 'c'} >{card[0]}</span>) : null}
      {thinking ? <div>Thinking...</div> : null}
    </div>
    </>
  )
}

export default App;