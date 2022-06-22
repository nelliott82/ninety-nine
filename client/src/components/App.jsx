import React, { useState } from 'react';

var shuffleDeck = function() {
  // Your code here
  var suits = [ '♥', '♣', '♠', '♦' ];
  var values = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];
  var deck = [];

  suits.forEach(function(suit) {
    values.forEach(function(value) {
      deck.push(value + suit);
    });
  });

  var total = deck.length;

  while (total) {
    var randomIndex = Math.floor(Math.random() * total--);
    [deck[randomIndex], deck[total]] = [deck[total], deck[randomIndex]];
  }
  return deck;
};

var App = () => {
  var [deck, setDeck] = useState(shuffleDeck());
  var [playerOne, setPlayerOne] = useState([]);
  var [started, setStarted] = useState(false);
  var [total, setTotal] = useState(0);

  function playCard(card) {
    setPlayerOne(playerOne.filter(inHand => inHand !== card).concat(deck.shift()));
    // Check for four special cards
    if (card[0] === '4') {
      // Eventually reverse order of play
    } else if (card[0] === '10') {
      setTotal(total - 10);
    } else if (card[0] === '9') {
      // Do nothing. 9 is hold.
    } else if (card[0] === 'K') {
      setTotal(99);
    // Check for Q or J
    } else if (card[0] === 'Q' || card[0] === 'J') {
      setTotal(total + 10);
    } else if (card[0] === 'A') {
      setTotal(total + 1);
    } else {
      setTotal(total + parseInt(card[0]));
    }
  }

  function startGame() {
    setPlayerOne([deck.shift(), deck.shift(), deck.shift()]);
    setStarted(true);
  }

  return (
    <>
    <div>{deck}</div>
    &nbsp;
    &nbsp;
    <div>
    {started ? <span>Game Total: {total}</span> : <button onClick={startGame}>Start Game</button>}
    </div>
    &nbsp;
    &nbsp;
    <div>
    {playerOne.length ? playerOne.map(card => <span onClick={() => playCard(card)} key={card} >{card}</span>) : null}
    </div>
    </>
  )
}

export default App;