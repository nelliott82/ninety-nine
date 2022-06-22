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
  var [played, setPlayed] = useState([]);
  var [computer, setComputer] = useState([]);
  var [playerOne, setPlayerOne] = useState([]);
  var [started, setStarted] = useState(false);
  var [turn, setTurn] = useState(true);
  var [thinking, setThinking] = useState(false);
  var [total, setTotal] = useState(0);

  function playCard(card, player) {
    if (player) {
      setPlayerOne(playerOne.filter(inHand => inHand !== card).concat(deck.shift()));
      setTurn(false);
    } else {
      setComputer(computer.filter(inHand => inHand !== card).concat(deck.shift()));
      setTurn(true);
    }
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
    setPlayed([...played, card]);
  }

  function computer() {
    setThinking(true);
    var thinkingTime = Math.random() * 5000 + 3000;
    setTimeout(() => {

      setThinking(false)
    }, thinkingTime);
  }

  function startGame() {
    setPlayerOne([deck[0], deck[2], deck[4]]);
    setComputer([deck[1], deck[3], deck[5]]);
    var deals = 6;
    while (deals) {
      deck.shift();
      deals--;
    }
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
      <div>Player One:</div>
    {playerOne.length ? playerOne.map(card => <span onClick={() => {if (turn) {playCard(card, true)}}} key={card} >{card}</span>) : null}
    </div>
    &nbsp;
    &nbsp;
    <div>
      <div>Computer:</div>
      {computer.length ? computer.map(card => <span onClick={() => playCard(card)} key={card} >{card}</span>) : null}
      {thinking ? <div>Thinking...</div> : null}
    </div>
    </>
  )
}

export default App;