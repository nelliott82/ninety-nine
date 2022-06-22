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

  function playCard() {

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
    {started ? null : <button onClick={startGame}>Start Game</button>}
    </div>
    &nbsp;
    &nbsp;
    <div>
    {playerOne.length ? playerOne.map(card => <span key={card} >{card}</span>) : null}
    </div>
    </>
  )
}

export default App;