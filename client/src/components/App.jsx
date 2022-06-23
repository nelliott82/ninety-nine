import React, { useState } from 'react';
import nikkoBot from '../helperFiles/computer.js';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import styled, { createGlobalStyle } from 'styled-components';
import ComputerComponent from './Computer.jsx';
import PlayingArea from './PlayingArea.jsx';
import PlayerOneComponent from './PlayerOne.jsx';

const GlobalStyle = createGlobalStyle`
  body {
    background: #C0DCC0;
  }
`
const CardFace = styled.img`
  width: 10%;
  border: 2px solid transparent;
  margin: 5px;
  cursor: pointer;
  &:hover {
    border: 2px solid blue;
    box-shadow: 0 0 10px blue;
    border-radius: 5%;
    transform: scale(1.1);
  }
`
CardFace.defaultProps = {
  src: ''
}

var syncTotal = 0;

var deck = shuffleDeck(createDeck());
var played = [];

var App = () => {
  var [computerHand, setComputerHand] = useState([]);
  var [playerOneHand, setPlayerOneHand] = useState([]);
  var [started, setStarted] = useState(false);
  var [turn, setTurn] = useState(true);
  var [thinking, setThinking] = useState(false);
  var [total, setTotal] = useState(0);
  var [strikes, setStrikes] = useState([0, 0]);
  var [over, setOver] = useState(false);

  function playCard(cardObj, player) {
    var card = cardObj[0];
    var newRound = false;

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
      if (syncTotal + 10 > 99) {
        gameOver();
        newRound = true;
      } else {
        setTotal(total => total + 10);
        syncTotal += 10;
      }

    } else if (card[0] === 'A') {
      if (syncTotal + 1 > 99) {
        gameOver();
        newRound = true;
      } else {
        setTotal(total => total + 1);
        syncTotal += 1;
      }

    } else {
      if (syncTotal + parseInt(card[0]) > 99) {
        gameOver();
        newRound = true;
      } else {
        setTotal(total => total + parseInt(card[0]));
        syncTotal += parseInt(card[0]);
      }

    }

    if (!newRound) {
      if (player) {
        setTurn(false);
        setPlayerOneHand(playerOneHand => [...playerOneHand.filter(inHand => inHand[0] !== card), deck.shift()]);
      } else {
        setComputerHand(computerHand => [...computerHand.filter(inHand => inHand[0] !== card), deck.shift()]);
        setTurn(true);
      }

      played = [...played, cardObj];
      if (player) {
        computer();
      }

      if (!deck.length) {
        deck = shuffleDeck(played);
        played = [];
      }
    } else {
      setTurn(true);
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

  function gameOver() {
    if (strikes[0] === 2 || strikes[1] === 2) {
      setOver(true);
    } else {
       if (turn) {
        setStrikes(strikes => [strikes[0], strikes[1] + 1]);
       } else {
        setStrikes(strikes => [strikes[0] + 1, strikes[1]]);
       }
       deck = shuffleDeck(createDeck());
       played = [];
       setTotal(total => 0);
       syncTotal = 0;
       setComputerHand(computerHand => []);
       setPlayerOneHand(playerOneHand => []);
       startGame();
    }
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
    <GlobalStyle/>
    <ComputerComponent strikes={strikes}
                       computerHand={computerHand}
                       thinking={thinking}
                       over={over} />
    &nbsp;
    &nbsp;
    <PlayingArea played={played} deck={deck} />
    &nbsp;
    &nbsp;
    <div>
    {started ? <span>Game Total: {total}</span> : <button onClick={startGame}>Start Game</button>}
    </div>
    &nbsp;
    &nbsp;
    <PlayerOneComponent strikes={strikes}
                        playerOneHand={playerOneHand}/>
    &nbsp;
    &nbsp;
    <div>
     {over ? strikes[0] === 2 ?
            <div>You lose. Computer wins.</div>
            :
            <div>Congrats! You beat the computer!</div>
     : null}
    </div>
    <a href="https://www.vecteezy.com/free-vector/playing-card-back">Playing Card Back Vectors by Vecteezy</a>
    </>
  )
}

export default App;