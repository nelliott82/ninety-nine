import React, { useState } from 'react';
import nikkoBot from '../helperFiles/computer.js';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ComputerComponent from './Computer.jsx';
import PlayingArea from './PlayingArea.jsx';
import PlayerOneComponent from './PlayerOne.jsx';
import SideBarComponent from './SideBar.jsx';

const GlobalStyle = createGlobalStyle`
  body {
    background: #C0DCC0;
  }
`

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 8fr;
  grid-template-rows: 5fr;
  justify-items: center;
  align-items: center;
`

const SideBar = styled.div`
  grid-column: 1;
  grid-row: 1;
`

const GameArea = styled.div`
  grid-column: 2;
  grid-row: 1;
`

const Attribution = styled.div`
  grid-column: 1;
  grid-row: 2
`

const StartModal = styled.div`
  z-index: auto;
  display: ${({ started }) => (started ? 'none' : 'block')};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width:100vw;
  background: rgba(0,0,0,0.5);
`;

const StartButtonContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const StartButton = styled.button`
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`
const fadeIn = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;
const fadeOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(.25);
    opacity: 0;
  }
`;
const fadeInModal = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 1;
  }
`;
const fadeOutModal = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;
const RoundMessageModal = styled.div`
  z-index: auto;
  visibility: ${({message}) => message ? 'visible' : 'hidden'};
  animation: ${({message}) => message ? fadeInModal : fadeOutModal} 0.5s linear;
  transition: visibility 0.5s linear;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width:100vw;
  background: rgba(0,0,0,0.5);
`;
const RoundMessage = styled.div`
  position: absolute;
  left: 45%;
  top: 45%;
  visibility: ${({message}) => message ? 'visible' : 'hidden'};
  animation: ${({message}) => message ? fadeIn : fadeOut} 0.5s linear;
  transition: visibility 0.5s linear;
  color: red;
  font-size: 5em;
`;
const OverMessageModal = styled.div`
  z-index: auto;
  visibility: ${({over}) => over ? 'visible' : 'hidden'};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width:100vw;
  background: rgba(0,0,0,0.5);
`;
const OverMessage = styled.div`
  position: absolute;
  left: 45%;
  top: 45%;
  visibility: ${({over}) => over ? 'visible' : 'hidden'};
  color: red;
  font-size: 5em;
`;

var syncTotal = 0;

var roundMessage = ['Begin!', 'Computer won! New round!', 'You won! New round!']
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
  var [message, setMessage] = useState(false);
  var [round, setRound] = useState(0);

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
        gameOver(player);
        newRound = true;
      } else {
        setTotal(total => total + 10);
        syncTotal += 10;
      }

    } else if (card[0] === 'A') {
      if (syncTotal + 1 > 99) {
        gameOver(player);
        newRound = true;
      } else {
        setTotal(total => total + 1);
        syncTotal += 1;
      }

    } else {
      if (syncTotal + parseInt(card[0]) > 99) {
        gameOver(player);
        newRound = true;
      } else {
        console.log(cardObj);
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
    var thinkingTime = syncTotal < 80 ? Math.random() * 3000 + 500 :Math.random() * 4000 + 1000 ;
    setTimeout(() => {
      playCard(nikkoBot.chooseCard(computerHand, syncTotal));
      setThinking(false)
    }, thinkingTime);
  }

  function gameOver(player) {
    if (strikes[0] === 2 || strikes[1] === 2) {
      if (player) {
        setStrikes(strikes => [3, strikes[1]]);
      } else {
        setStrikes(strikes => [strikes[0], 3]);
      }
      setOver(true);
    } else {
      setRound(round => round + 1);
      displayMessage();
      if (player) {
        setStrikes(strikes => [strikes[0]+ 1, strikes[1]]);
      } else {
        setStrikes(strikes => [strikes[0], strikes[1] + 1]);
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
    displayMessage();
    var deals = 6;
    while (deals) {
      deck.shift();
      deals--;
    }
    setStarted(true);
  }

  function displayMessage() {
    setMessage(message => true);
    setTimeout(() => {
      setMessage(message => false);
    }, 2000)
  }

  return (
    <>
    <GlobalStyle/>
    <StartModal started={started} >
      <StartButtonContainer>
        <StartButton onClick={startGame}>Start Game</StartButton>
      </StartButtonContainer>
    </StartModal>
    <RoundMessageModal message={message} />
    <RoundMessage message={message} >
        {round ?
          strikes[0] > strikes[1] ?
          roundMessage[1] :
          roundMessage[2]
        : roundMessage[0]}
    </RoundMessage>
    <OverMessageModal over={over} />
    <OverMessage over={over}>
      {strikes[0] === 3 ?
      <div>You lose. Computer wins.</div>
      :
      <div>Congrats! You beat the computer!</div>}
    </OverMessage>
    <MainContainer>
      <SideBar>
        <SideBarComponent/>
      </SideBar>
      <GameArea>
        <ComputerComponent strikes={strikes}
                          computerHand={computerHand}
                          thinking={thinking}
                          over={over} />

        <PlayingArea played={played} deck={deck} />
        <span>Game Total: {total}</span>
        <PlayerOneComponent strikes={strikes}
                            playerOneHand={playerOneHand}
                            turn={turn}
                            playCard={playCard} />
      </GameArea>
      <Attribution>
        <a href="https://www.vecteezy.com/free-vector/playing-card-back">Playing Card Back Vectors by Vecteezy</a>
      </Attribution>
    </MainContainer>
    </>
  )
}

export default App;