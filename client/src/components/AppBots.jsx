import React, { useState, useEffect } from 'react';
import nikkoBot from '../helperFiles/computer.js';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ComputerComponent from './Computer.jsx';
import PlayingArea from './PlayingArea.jsx';
import PlayerOneComponent from './PlayerOne.jsx';
import DropDownComponent from './DropDown.jsx';
import StartComponent from './Start.jsx';
import TotalComponent from './Total.jsx';

const GlobalStyle = createGlobalStyle`
  body {
    overflow-x: hidden;
    background: #C0DCC0;
    position: relative;
  }
`;

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 5fr;
  justify-items: center;
  align-items: center;
  @media (max-width: 1000px) {
    width: 90vw;
  }
`;

const GameArea = styled.div`
  grid-column: 1;
  grid-row: 1;
`;

const PlayerArea1 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 5px;
`;

const PlayerArea2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 5px;
  @media (max-width: 1170px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 0.1fr;
  }
`;

const Opponent = styled.div`
  width: 100%;
  height: 195%;
  grid-column: 2;
  grid-row: 1;
  @media (max-width: 1170px) {
    width: 90vw;
    height: 1%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-rows: ${({botsCount}) => {
      if (botsCount > 1) {
        return '0.5fr '.repeat(botsCount).trim();
      } else {
        return '1fr';
      }
    }};
    ${({botsCount}) => {
      if (botsCount) {
        return 'margin-top: 20px; margin-bottom: -5px;';
      }
    }}
  }
`;

const BotAreaMobile = styled.div`
  display: none;
  @media (max-width: 1170px) {
    display: unset;
    width: 90vw;
    height: 60%;
    grid-column: 1;
    grid-row: ${({row}) => row};
  }
`;
const BotArea = styled.div`
  @media (max-width: 1170px) {
    display: none;
  }
`;

const Player = styled.div`
  width: 100%;
  height: 195%;
  grid-column: 2;
  grid-row: 1;
  @media (max-width: 1170px) {
    width: 90vw;
  }
`;

const ForfeitButton = styled.button`
  width: 5rem;
  height: 2rem;
  font-size: 1em;
  grid-column: 3;
  grid-row: 1;
  justify-self: left;
  align-self: center;
  @media (max-width: 1170px) {
    justify-self: center;
    grid-column: 2;
    grid-row: 2;
  }
`

const CenterRowArea = styled.div`
  width: 100%;
  height: 15rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  @media (max-width: 1000px) {
    width: 90vw;
    height: 11.5rem;
    margin-top: 5px;
  }
`

const DeckArea = styled.div`
  width: 100%;
  height: 195%;
  grid-column: ${({column}) => column};
  grid-row: 1;
  @media (max-width: 1170px) {
    width: 95vw;
  }
`

const OpponentArea = styled.div`
  width: 100%;
  height: 195%;
  grid-column: ${({column}) => column};
  grid-row: 1;
  @media (max-width: 1170px) {
    display: none;
  }
`

const Attribution = styled.div`
  grid-column: 1;
  grid-row: 2;
  justify-self: start;
`;

const StartModal = styled.div`
  z-index: auto;
  display: ${({ started }) => (started ? 'none' : 'block')};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
`;

const fadeIn = keyframes`
  from {
    transform: scale(1) translate(-50%);;
    opacity: 1;
  }

  to {
    transform: scale(1) translate(-50%);;
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    transform: scale(1) translate(-50%);;
    opacity: 1;
  }

  to {
    transform: scale(.25) translate(-50%);;
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
  visibility: ${({displayMessage}) => displayMessage ? 'visible' : 'hidden'};
  animation: ${({displayMessage}) => displayMessage ? fadeInModal : fadeOutModal} 0.5s linear;
  transition: visibility 0.5s linear;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
`;

const RoundMessage = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  visibility: ${({displayMessage}) => displayMessage ? 'visible' : 'hidden'};
  animation: ${({displayMessage}) => displayMessage ? fadeIn : fadeOut} 0.5s linear;
  transition: visibility 0.5s linear;
  color: red;
  font-size: 3em;
`;

const OverMessageModal = styled.div`
  z-index: auto;
  visibility: ${({over}) => over ? 'visible' : 'hidden'};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
`;

const OverMessage = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  visibility: ${({over}) => over ? 'visible' : 'hidden'};
  color: red;
  font-size: 3em;
  text-align: center;
`;

let syncTotal = 0;

let roundMessages = ['Begin!', 'Computer won! New round!', 'You won! New round!'];
let message;
let winner = 0;
let deck = shuffleDeck(createDeck());
let played = [];
let reverse = false;

const AppBots = ({ setStarted }) => {
  let [hands, setHands] = useState({
    0: [],
    1: [],
    2: [],
    3: []
  })
  // MAKE TURN A TRUE/FALSE VALUE ON PLAYER/OPPONENT OBJECTS
  let [turn, setTurn] = useState(true);
  let [thinking, setThinking] = useState(false);
  let [total, setTotal] = useState(0);
  let [strikes, setStrikes] = useState([0, 0, 0, 0]);
  let [over, setOver] = useState(false);
  let [displayMessage, setDisplayMessage] = useState(false);
  let [round, setRound] = useState(0);
  let [players, setPlayers] = useState([0, 1]);
  let [botsArray, setBotsArray] = useState([{ turn: false }]);

  function playCard(cardObj, player) {
    let newRound = false;
    setTurn(false);

    if (cardObj[0][0] === '4') {
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
      calculateNextPlayer(player);

      let tempHands = hands;
      tempHands[player] = [...hands[player].filter(inHand => inHand[0] !== cardObj[0]), deck.shift()]
      setHands(hands => tempHands);

      played = [...played, cardObj];

      if (!deck.length) {
        deck = shuffleDeck(played);
        played = [];
      }
    }
  }

  function calculateNextPlayer (player) {
    let nextPlayer = player;
    let moveOn = true;

    while (moveOn) {
      if (nextPlayer === 0) {
        nextPlayer = reverse ? players.length - 1 : nextPlayer + 1;

      } else if (players.length > nextPlayer + 1) {
        nextPlayer = reverse ? nextPlayer - 1 : nextPlayer + 1;

      } else {
        nextPlayer = reverse ? nextPlayer - 1 : 0;

      }
      if (strikes[nextPlayer] !== 3) {
        moveOn = false;
      }
    }

    let tempBotsArray = botsArray;
    let botsTurn = false;
    for (let i = 0; i < tempBotsArray.length; i++) {
      tempBotsArray[i].turn = (i === (nextPlayer - 1));
      if (i === (nextPlayer - 1)) {
        botsTurn = true;
      }
    }
    setBotsArray(botsArray => [...tempBotsArray]);

    if (nextPlayer !== 0) {
      computer(nextPlayer);
    } else {
      setTurn(true);
    }
  }

  function computer(bot) {
    let thinkingTime = syncTotal < 80 ? Math.random() * 3000 + 1000 : Math.random() * 4000 + 1000;
    setTimeout(() => {
      playCard(nikkoBot.chooseCard(hands[bot], syncTotal), bot);
    }, thinkingTime);
  }

  function deal(strikesArr = strikes) {
    let deals = 3;
    let tempHands = {
      0: [],
      1: [],
      2: [],
      3: []
    };
    while (deals) {
      players.forEach(player => {
        if (strikesArr[player] < 3) {
          tempHands[player] = [...tempHands[player], deck.shift()]
          setHands(hands => tempHands);
        }
      })
      deals--;
    }
  }

  function startGame(player = undefined, strikesArr = strikes) {
    setAndDisplayMessage(player);
    deal(strikesArr);
    setStarted(true);
  }

  function gameOver(player) {
    let tempStrikes = strikes;
    let countDone = 0;

    if (strikes[player] === 2) {
      tempStrikes[player] = 3;
      setStrikes(strikes => [...tempStrikes]);
      for (let i = 1; i < tempStrikes.length; i++) {
        if (tempStrikes[i] === 3) {
          countDone++;
        }
      }
    }

    if (countDone === players.length - 1 || tempStrikes[0] === 3) {
      setOver(true);
    } else {

      setRound(round => round + 1);

      if (tempStrikes[player] < 3) {
        tempStrikes[player] += 1;
      }

      setStrikes(strikes => [...tempStrikes]);

      if (player === 0) {
        winner = 1;
      } else {
        winner = 0;
      }

      deck = shuffleDeck(createDeck());
      played = [];

      setTotal(total => 0);
      syncTotal = 0;

      setTurn(turn => turn = 0);

      startGame(player, tempStrikes);
    }
  }

  function selectBots(e) {
    let num = parseInt(e.target.value);
    setBotsArray(botsArray => [...Array(num).fill('').map(() => {
                                                          return { turn: false }
                                                        })]);
    setPlayers(players => [...Array(num + 1).keys()]);
  }

  function setAndDisplayMessage(player = undefined) {
    let strikeOrLost = strikes[player] < 3 ? 'got a strike' : 'lost';
    if (player === 0) {
      message = `You ${strikeOrLost}! New round!`;
    } else if (player) {
      message = `Computer ${player} ${strikeOrLost}! New round!`;
    } else {
      message = 'Begin!';
    }
    setDisplayMessage(displayMessage => true);
    setTimeout(() => {
      setDisplayMessage(displayMessage => false);
    }, 2000)
  }

  return (
    <>
    <StartComponent startGame={startGame} selectBots={selectBots} opponents={'Computer'} />
    <RoundMessageModal displayMessage={displayMessage} />
    <RoundMessage displayMessage={displayMessage} >
      {message}
    </RoundMessage>
    <OverMessageModal over={over} />
    <OverMessage over={over}>
      {strikes[0] === 3 ?
      <div>You lose.</div>
      :
      <div>Congrats! You win!</div>}
    </OverMessage>
    <MainContainer>
      <GameArea>
        <PlayerArea1>
          <Opponent botsCount={botsArray.length} >
          {botsArray[1] ?
              <>
              {botsArray.map((bot, i) =>
                <BotAreaMobile row={i + 1} key={i}>
                  <ComputerComponent strikes={strikes}
                                     computerHand={hands[i + 1]}
                                     thinking={thinking}
                                     over={over}
                                     turn={bot.turn}
                                     player={i + 1}
                                     botsCount={botsArray.length} />
                </BotAreaMobile>
              )}
              <BotArea>
                <ComputerComponent strikes={strikes}
                                   computerHand={hands[2]}
                                   thinking={thinking}
                                   over={over}
                                   turn={botsArray[1].turn}
                                   player={2} />
              </BotArea>
              </>
              :
              <ComputerComponent strikes={strikes}
                                 computerHand={hands[1]}
                                 thinking={thinking}
                                 over={over}
                                 turn={botsArray[0].turn}
                                 player={1} /> }
          </Opponent>
        </PlayerArea1>
        <CenterRowArea>
          <OpponentArea column={1}>
            {botsArray[1] ?
              <ComputerComponent strikes={strikes}
                                 computerHand={hands[1]}
                                 thinking={thinking}
                                 over={over}
                                 turn={botsArray[0].turn}
                                 player={1} /> :
                                 null}
          </OpponentArea>
          <DeckArea column={2}>
            <PlayingArea played={played} deck={deck} />
          </DeckArea>
          <OpponentArea column={3}>
            {botsArray[2] ?
                <ComputerComponent strikes={strikes}
                                   computerHand={hands[3]}
                                   thinking={thinking}
                                   over={over}
                                   turn={botsArray[2].turn}
                                   player={3} /> :
                                   null}
          </OpponentArea>
        </CenterRowArea>
        <TotalComponent total={total} />
        <PlayerArea2>
          <Player>
            <PlayerOneComponent strikes={strikes}
                                playerOneHand={hands[0]}
                                gameOver={gameOver}
                                turn={turn}
                                playCard={playCard} />
          </Player>
          <ForfeitButton onClick={() => {if (turn === 0) { gameOver(0) }}} >Forfeit</ForfeitButton>
        </PlayerArea2>
      </GameArea>
      <Attribution>
        <a href="https://www.vecteezy.com/free-vector/playing-card-back">Playing Card Back Vectors by Vecteezy</a>
      </Attribution>
    </MainContainer>
    </>
  )
}

export default AppBots;