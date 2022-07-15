import React, { useState } from 'react';
import nikkoBot from '../helperFiles/computer.js';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ComputerComponent from './Computer.jsx';
import PlayingArea from './PlayingArea.jsx';
import PlayerOneComponent from './PlayerOne.jsx';
import SideBarComponent from './SideBar.jsx';
import TotalComponent from './Total.jsx';

const GlobalStyle = createGlobalStyle`
  body {
    background: #C0DCC0;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 8fr;
  grid-template-rows: 5fr;
  justify-items: center;
  align-items: center;
`;

const SideBar = styled.div`
  grid-column: 1;
  grid-row: 1;
`;

const GameArea = styled.div`
  grid-column: 2;
  grid-row: 1;
`;

const OpponentsArea = styled.div`
  display: grid;
  grid-template-columns: ${({bots}) => ('1fr ').repeat(bots).trim()};
  grid-template-rows: 1fr;
  gap: 5px;
`;

const Opponent = styled.div`
  width: 100%;
  height: 195%;
  grid-column: ${({column}) => column};
  grid-row: 1;
`;

const Attribution = styled.div`
  grid-column: 1;
  grid-row: 2
`;

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

const StartContainer = styled.div`
  position: absolute;
  background-color: white;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const BotsDropDownLabel = styled.div`
  grid-row: 1;
  width: 5rem;
  height: 2rem;
  font-size: 1.5em;
`;

const BotsDropDown = styled.select`
  grid-row: 2;
  width: 5rem;
  height: 2rem;
  font-size: 1.5em;
`;

const StartButton = styled.button`
  grid-row: 3;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

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
  font-size: 3em;
  text-align: center;
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
  font-size: 3em;
  text-align: center;
`;

var syncTotal = 0;

var roundMessage = ['Begin!', 'Computer won! New round!', 'You won! New round!']
var winner = 0;
var deck = shuffleDeck(createDeck());
var played = [];
var reverse = false;

var App = () => {
  var [computerOneHand, setComputerOneHand] = useState([]);
  var [computerTwoHand, setComputerTwoHand] = useState([]);
  var [computerThreeHand, setComputerThreeHand] = useState([]);
  var [playerOneHand, setPlayerOneHand] = useState([]);
  var [started, setStarted] = useState(false);
  var [turn, setTurn] = useState(true);
  var [thinking, setThinking] = useState(false);
  var [total, setTotal] = useState(0);
  var [strikes, setStrikes] = useState([0, 0]);
  var [over, setOver] = useState(false);
  var [message, setMessage] = useState(false);
  var [round, setRound] = useState(0);
  var [players, setPlayers] = useState([0]);
  var [botsArray, setBotsArray] = useState([1]);

  function playCard(cardObj, player) {
    var newRound = false;

    if (cardObj[0][0] === '4') {
      // Eventually reverse order of play
      reverse = !reverse;

    } else if (cardObj[0][0] === 'K') {
      setTotal(total => 99);
      syncTotal = 99;

    } else {
      if (syncTotal + cardObj[1] > 99) {
        gameOver(player);
        newRound = true;
      } else {
        setTotal(total => total += cardObj[1]);
        syncTotal += cardObj[1];
      }

    }

    if (!newRound) {
      if (player === 0) {
        setTurn(player => reverse ? players.length - 1 : player + 1);
        setPlayerOneHand(playerOneHand => [...playerOneHand.filter(inHand => inHand[0] !== cardObj[0]), deck.shift()]);
      } else if (player === 1) {
        setComputerOneHand(computerOneHand => [...computerOneHand.filter(inHand => inHand[0] !== cardObj[0]), deck.shift()]);
        if (players.length === 2) {
          setTurn(player => reverse ? player + 1 : player - 1);
        }
      } else if (player === 2) {
        setComputerTwoHand(computerTwoHand => [...computerTwoHand.filter(inHand => inHand[0] !== cardObj[0]), deck.shift()]);
        if (players.length === 3) {
          setTurn(player => reverse ? player + 1 : player - 1);
        }
      } else {
        setComputerThreeHand(computerThreeHand => [...computerThreeHand.filter(inHand => inHand[0] !== cardObj[0]), deck.shift()]);
        setTurn(player => reverse ? player - 1 : 0);
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
    var thinkingTime = syncTotal < 80 ? Math.random() * 3000 + 1000 : Math.random() * 4000 + 1000;
    setTimeout(() => {
      playCard(nikkoBot.chooseCard(computerHand, syncTotal));
      setThinking(false);
    }, thinkingTime);
  }

  function gameOver(player) {
    if (player && strikes[0] === 2) {
      setStrikes(strikes => [3, strikes[1]]);
      setOver(true);
    } else if (!player && strikes[1] === 2) {
      setStrikes(strikes => [strikes[0], 3]);
      setOver(true);
    } else {
      setRound(round => round + 1);
      if (player) {
        winner = 1;
        setStrikes(strikes => [strikes[0]+ 1, strikes[1]]);
      } else {
        winner = 0;
        setStrikes(strikes => [strikes[0], strikes[1] + 1]);
      }
      displayMessage();
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

  function selectBots(e) {
    let num = parseInt(e.target.value);
    setBotsArray(botsArray => [...Array(num).keys()]);
    setPlayers(players => [...Array(num + 1).keys()]);
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
      <StartContainer>
        <BotsDropDownLabel>Select number of computer opponents: </BotsDropDownLabel>
        <BotsDropDown onChange={(e) => selectBots(e)}>
          <option value='1' >1</option>
          <option value='2' >2</option>
          <option value='3' >3</option>
        </BotsDropDown>
        <StartButton onClick={startGame}>Start Game</StartButton>
      </StartContainer>
    </StartModal>
    <RoundMessageModal message={message} />
    <RoundMessage message={message} >
       <div>{round ?
          winner ?
          roundMessage[1] :
          roundMessage[2]
        : roundMessage[0]}</div>
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
        <OpponentsArea bots={botsArray.length}>
          {botsArray.length
            ? botsArray.map((bot, i) =>
                  (
                    <Opponent column={i + 1}>
                      <ComputerComponent strikes={strikes}
                                         computerHand={computerHand}
                                         thinking={thinking}
                                         over={over}
                                         turn={bot + 1}
                                         player={bot + 1} />
                    </Opponent>
                  ))
            : null}
        </OpponentsArea>

        <PlayingArea played={played} deck={deck} />
        <TotalComponent total={total} />
        <PlayerOneComponent strikes={strikes}
                            playerOneHand={playerOneHand}
                            gameOver={gameOver}
                            turn={0}
                            player={0}
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