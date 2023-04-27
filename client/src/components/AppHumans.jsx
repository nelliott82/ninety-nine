import React, { useContext, useState, useEffect } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import styled, { keyframes } from 'styled-components';
import ComputerComponentMap from './ComputerMap.jsx';
import ComputerComponent from './Computer.jsx';
import PlayingArea from './PlayingArea.jsx';
import PlayerOneComponent from './PlayerOne.jsx';
import DropDownComponent from './DropDown.jsx';
import UsernameComponent from './Username.jsx';
import StartComponent from './Start.jsx';
import WaitingComponent from './Waiting.jsx';
import PasswordComponent from './Password.jsx';
import TotalComponent from './Total.jsx';
import nikkoBot from '../helperFiles/computer.js';
import socket from '../helperFiles/socket.js';
import { getCookie, setCookies, deleteCookies, makeCookieObject } from '../helperFiles/cookies.js';

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 5fr;
  justify-items: center;
  align-items: center;
  overflow-y: auto;
  ${'' /* @media (max-width: 1000px) {
    width: 90vw;
  } */}
`;

const GameArea = styled.div`
  grid-column: 1;
  grid-row: 1;
`;

const PlayerArea1 = styled.div`
  display: grid;
  height: 15rem;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 5px;
  @media (max-width: 1240px) {
    height: auto;
  }
`;

const PlayerArea2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 5px;
  @media (max-width: 1240px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 0.1fr;
  }
`;

const Opponent = styled.div`
  width: 100%;
  height: 195%;
  grid-column: 2;
  grid-row: 1;
  @media (max-width: 1240px) {
    width: 100%;
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
  @media (max-width: 1240px) {
    display: unset;
    width: 90vw;
    height: 60%;
    grid-column: 1;
    grid-row: ${({row}) => row};
  }
`;
const BotArea = styled.div`
  @media (max-width: 1240px) {
    display: none;
  }
`;

const Player = styled.div`
  width: 100%;
  height: 195%;
  grid-column: 2;
  grid-row: 1;
  @media (max-width: 1240px) {
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
  @media (max-width: 1240px) {
    justify-self: center;
    grid-column: 2;
    grid-row: 2;
  }
`

const GameOverButton = styled.button`
  width: 6rem;
  height: 2rem;
  font-size: 1em;
  visibility: ${({ gameOver }) => gameOver ? 'visible' : 'hidden'};
  position: absolute;
  left: 50%;
  top: ${({ top }) => top};
  transform: translate(-50%);
`

const CenterRowArea = styled.div`
  width: 100%;
  height: 15rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  @media (max-width: 1240px) {
    height: 11.5rem;
    margin-top: 5px;
  }
`

const DeckArea = styled.div`
  width: 100%;
  height: 195%;
  grid-column: ${({column}) => column};
  grid-row: 1;
  @media (max-width: 1240px) {
    width: 95vw;
  }
`

const OpponentArea = styled.div`
  width: 100%;
  height: 195%;
  grid-column: ${({column}) => column};
  grid-row: 1;
  @media (max-width: 1240px) {
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
  display: ${({ started }) => (started ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
`;

const fadeIn = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
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
  z-index: 99;
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
  z-index: 100;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%);
  visibility: ${({displayMessage}) => displayMessage ? 'visible' : 'hidden'};
  animation: ${({displayMessage}) => displayMessage ? fadeIn : fadeOut} 0.5s linear;
  transition: visibility 0.5s linear;
  color: red;
  font-size: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100vw;
`;

const RoomModal = styled.div`
  z-index: auto;
  visibility: ${({ on }) => on ? 'visible' : 'hidden'};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
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
  top: 40%;
  transform: translate(-50%);
  visibility: ${({over}) => over ? 'visible' : 'hidden'};
  color: red;
  font-size: 3em;
  text-align: center;
  width: 100vw;
`;

let navigated = false;
let timerDelay = 15;
let syncTotal = 0;
let syncCountdown = timerDelay;
let dummyUsernames = new Array(2).fill('')
                                 .map(() => { return { username: 'Waiting...',
                                                       strikes: 0,
                                                       active: false,
                                                       hand: [],
                                                       turn: false } });
let syncUsernames = dummyUsernames;
let timerId;

let message;
let deck = shuffleDeck(createDeck());
let played = [];
let reverse = false;
let chosenName = 'Waiting...';
let count = 4;
let playerId = '';
let finalStrikes = 0;

const AppHumans = (props) => {
  const location = useLocation();
  let { state } = location;
  if (!state) {
    state = {};
  }
  const navigate = useNavigate();

  const [display, setDisplay] = useState(false);
  const [on, setOn] = useState(true);
  const [human, setHuman] = useState(false);
  const [computer, setComputer] = useState(false);
  const [total, setTotal] = useState(0);
  const [over, setOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [overMessage, setOverMessage] = useState(false);
  const [waitingCount, setWaitingCount] = useState(4);
  const [displayCountdown, setDisplayCountdown] = useState(false);
  const [password, setPassword] = useState('');
  const [gameStateTimer, setGameStateTimer] = useState(timerDelay);
  const [enterPassword, setEnterPassword] = useState(false);
  const [usernameChoice, setUsernameChoice] = useState(true);
  const [usernameMessage, setUsernameMessage] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [usernames, setUsernames] = useState(dummyUsernames);
  const [start, setStart] = useState(false);
  const [created, setCreated] = useState(false);
  const [creator, setCreator] = useState(false);
  let [setStarted, started] = useOutletContext();
  let { roomCode } = useParams();

  function timer() {
    clearTimeout(timerId);
    if (syncCountdown > 0) {
      timerId = setTimeout(() => {
        syncCountdown -= 1;
        timer();
      }, 1000)
    } else {
      if (syncUsernames[0].turn) {
        //playCard(syncUsernames[0].hand[0], 0);
      }
    }
  }

  function restartTimer(delay) {
    clearTimeout(timerId);
    syncCountdown = timerDelay;
    setTimeout(() => {
      setDisplayCountdown(true);
      timer();
    }, delay);
  }

  const cookies = makeCookieObject();

  function sortUsernames(playerObjects, i) {
    let sorted = false;

    while (!sorted) {
      if (playerObjects[0].index !== i) {
        playerObjects.push(playerObjects.shift());
      } else {
        sorted = true;
      }
    }

    playerObjects[0].hand = syncUsernames[0].hand;

    return playerObjects;
  }

  function applyPlayers(players, keys) {
    for (let i = 0; i < players.length; i++) {
      if (!syncUsernames[i] || !keys) {
        syncUsernames[i] = players[i];
      } else if (syncUsernames[i].username !== players[i].username) {
        syncUsernames[i] = players[i];
      } else {
        for (let j = 0; j < keys.length; j++) {
          syncUsernames[i][keys[j]] = players[i][keys[j]];
        }
      }
    }

    setUsernames(usernames => [...syncUsernames]);
    return syncUsernames;
  }

  function setIndex(j, change) {
    j = j + change;
    if (j < 0) {
      j = syncUsernames.length - 1;
    } else if (j === syncUsernames.length) {
      j = 0;
    }
    return j;
  }

  function calculateNextPlayer (i) {
    let setNextPlayer = false;
    let change = reverse ? -1 : 1;
    let j = setIndex(i, change);

    while (!setNextPlayer) {
      if (syncUsernames[j].strikes < 3) {
        setNextPlayer = true;
      } else {
        j = setIndex(j, change);
      }
    }

    syncUsernames[i].turn = false;
    syncUsernames[j].turn = true;
    setUsernames(usernames => [...syncUsernames]);
    return syncUsernames[j].index;
  }

  function setNewRound(player, playerId) {
    syncUsernames[player].strikes += 1;
    setUsernames([...syncUsernames]);
    let nextPlayer = calculateNextPlayer(player);

    human && socket.emit('newRound', roomCode, syncUsernames[0].index, nextPlayer, playerId, reverse);

    if (computer) {
      let countDone = syncUsernames.length;

      if (syncUsernames[player].strikes === 3) {
        for (let i = 1; i <syncUsernames.length; i++) {
          if (syncUsernames[i].strikes === 3) {
            countDone -= 1;
          }
        }
      }

      if (countDone === 1 || syncUsernames[0].strikes === 3) {
        setOver(true);
        setGameOver(true);
        let message = countDone === 1 ? 'You win!' : 'You lose!'
        setOverMessage(`Game over!\n\n${message}`);
      } else {

        deck = shuffleDeck(createDeck());
        played = [];

        setTotal(total => 0);
        syncTotal = 0;

        syncUsernames.forEach(player => {
          player.turn = false;
          player.hand = [];
        });
        setUsernames(usernames => [...syncUsernames]);
        setAndDisplayMessage(player, syncUsernames[player].strikes);

        startGame();
      }
    }

    return true;
  }

  function bot(bot) {
    let thinkingTime = syncTotal < 80 ? Math.random() * 3000 + 1000 : Math.random() * 4000 + 1000;
    setTimeout(() => {
      playCard(nikkoBot.chooseCard(syncUsernames[bot].hand, syncTotal), bot);
    }, thinkingTime);
  }

  function playCard(cardObj, player) {
    human && clearTimeout(timerId);
    let newRound = false;
    if (!syncUsernames[player].turn) {
      return;
    }
    if (cardObj[0][0] === '4') {
      reverse = !reverse;

    } else if (cardObj[0][0] === 'K') {
      setTotal(total => 99);
      syncTotal = 99;

    } else {
      if (syncTotal + cardObj[1] > 99) {
        newRound = setNewRound(player, cookies.playerId);
      } else {
        setTotal(total => total += cardObj[1]);
        syncTotal += cardObj[1];
      }

    }

    if (!newRound) {
      let nextPlayer = calculateNextPlayer(player);
      played.push(cardObj);

      if (human) {
        socket.emit('playCard', cardObj, roomCode, reverse, syncTotal, syncUsernames[0].index, nextPlayer, cookies.playerId)
        syncCountdown = timerDelay;
        setGameStateTimer(timerDelay);
        timer();
      }

      if (computer) {

        if (nextPlayer > 0) {
          bot(nextPlayer);
        }

        syncUsernames[player].hand = [...syncUsernames[player].hand.filter(inHand => inHand[0] !== cardObj[0]), deck.shift()];

        setUsernames(usernames => [...syncUsernames]);

        if (!deck.length) {
          deck = shuffleDeck(played);
          played = [];
        }

      }
    }
  }

  function deal() {
    let deals = 3;

    while (deals) {
      syncUsernames.forEach((player, i) => {
        if (player.strikes < 3) {
          player.hand = [...player.hand, deck.shift()];
        }
        if (player.hand.length > 3) {
          player.hand = player.hand.slice(player.hand.length - 3);
        }
      })
      deals--;
    }

    syncUsernames[0].turn = true;
    setUsernames(usernames => [...syncUsernames]);
  }

  function startGame() {

    if (human) {
      setWaiting(waiting => true);

      socket.emit('create', roomCode, cookies.playerId, state.setPassword, usernames[0].username, usernames.length);

    } else {
      syncUsernames.forEach((player, i) => player.index = i);
      setOn(false);
      deal();
    }

  }

  function selectBots(e) {
    let num = parseInt(e.target.value);
    syncUsernames = [...syncUsernames.slice(0, 1), ...Array(num).fill('')
                                                                .map(() => { return { username: 'Waiting...',
                                                                                      strikes: 0,
                                                                                      active: false,
                                                                                      hand: [],
                                                                                      turn: false } })]

    setUsernames(usernames => [...syncUsernames]);
  }

  function setAndDisplayMessage(player = undefined, strikes) {
    let strikeOrLost = strikes < 3 ? 'got a strike' : 'lost';
    let integer = Number.isInteger(player);
    if (player === chosenName || (integer && !player)) {
      message = `You ${strikeOrLost}! New round!`;
    } else if (player) {
      let append = integer ? 'Computer ' : '';
      message = `${append + player}\n\n${strikeOrLost}!\n\nNew round!`;
    } else {
      message = 'Begin!';
    }
    setDisplayMessage(displayMessage => true);
    setTimeout(() => {
      setDisplayMessage(displayMessage => false);
    }, 2000)
  }

  function saveUsername(username) {
    chosenName = username;

    if (!creator) {
      socket.emit('username', roomCode, username, cookies.playerId);
    } else {
      setUsernameChoice(false);
      syncUsernames = [{ username, strikes: 0, hand: [], turn: true }, ...syncUsernames.slice(1)];
      setUsernames(usernames => [...syncUsernames]);
      setStart(true);
    }
  }

  function setHands(players) {
    return players.map((player, i) => {
      if (i && player.strikes < 3 &&
          chosenName !== 'Waiting...') {
        player.hand = [1, 2, 3];
      }
      return player;
    })
  }

  function replay() {
    if (!endGame && human) {
      let cookies = makeCookieObject();
      socket.emit('replay', roomCode, cookies.playerId);
    } else {
      setOver(false);
      setGameOver(false);
      syncUsernames.forEach(player => {
        player.strikes = 0;
        player.turn = false;
        player.hand = [];
      });
      setTotal(0);
      syncTotal = 0;
      deck = shuffleDeck(createDeck());
      played = [];
      setUsernames(usernames => [...syncUsernames]);
      startGame();
    }
  }

  function endGameFunc() {
    setEndGame(true);
    if (human) {
      let cookies = makeCookieObject();
      socket.emit('endGame', roomCode, cookies.playerId);
    } else {
      const refreshKey = Math.random().toString(36).substring(2);
      navigate('/select', { state: { refreshKey } });
    }
  }

  function resetState() {
    syncUsernames = dummyUsernames;
    setDisplay(false);
    setStarted(false);
    setOn(true);
    setHuman(false);
    setComputer(false);
    setTotal(0);
    setOver(false);
    setGameOver(false);
    setEndGame(false);
    setDisplayMessage(false);
    setOverMessage(false);
    setWaitingCount(4);
    setDisplayCountdown(false);
    setPassword('');
    setGameStateTimer(timerDelay);
    setEnterPassword(false);
    setUsernameChoice(true);
    setUsernameMessage(false);
    setWaiting(false);
    setUsernames(dummyUsernames);
    setStart(false);
    setCreated(false);
    setCreator(false);
  }

  useEffect(() => {

    if (location.pathname !== '/computers') {
      socket.connect();
      setHuman(true);

      if (cookies.playerId) {
        let hasPassword = !state.hasOwnProperty('setPassword') ? false : true;
        socket.emit('enter', roomCode, cookies.playerId, hasPassword);
      } else {
        setUsernameChoice(false);
        setOn(true);
        setStarted(true);
        setEnterPassword(true);
      }

      socket.on('players', (players, i, restart, newHand, creating) => {
        if (creating) {
          setCreated(true);
        }

        if (restart) {
          finalStrikes = 0;
          setOver(false);
          setGameOver(false);
        }

        count = players.reduce((accum, player) => {
          if (player.username === "Waiting...") {
            accum += 1;
          }
          return accum;
        }, 0)
        setWaitingCount(count);

        if (!count) {
          setWaiting(false);
          setOn(false);
          setAndDisplayMessage();
          setGameStateTimer(timerDelay);
          restartTimer(2500);
          socket.emit('startTimer', roomCode, cookies.playerId);
        }

        if (newHand) {
          syncUsernames[0].hand = [...newHand];
          setUsernames(usernames => [...syncUsernames]);
        }

        applyPlayers(setHands(sortUsernames(players, i)));
      });

      socket.on('playerEnter', (players, i, playTimer) => {
        players = applyPlayers(setHands(sortUsernames(players, i)), ['active', 'username', 'hand', 'index']);

        let playerState = players.reduce((accum, player) => {
          if (player.username === "Waiting...") {
            accum.waiting = true;
            accum.count += 1;
          }
          if (!player.active) {
            accum.inactive += 1;
          }
          if (player.strikes === 3) {
            accum.strikes += 1;
          }
          return accum;
        }, { waiting: false, count: 0, inactive: 0, strikes: 0 });

        if (chosenName !== 'Waiting...') {
          setWaiting(playerState.waiting);
          setOn(playerState.waiting);
        }
        setStarted(true);

        setWaitingCount(playerState.count);

        finalStrikes = players[0].strikes;
        if (finalStrikes === 3) {
          setOver(true);
          setOverMessage('You lose.');
        }

        if ((playerState.strikes === players.length - 1) ||
            (playerState.inactive === players.length - 1) &&
             !playerState.waiting &&
             playTimer === -1) {
          setDisplayCountdown(false);
          setTotal(0);
          syncTotal = 0;
          setOver(true);
          finalStrikes < 3 && setOverMessage('Congrats! You win!');
          setGameOver(true);
          played = [];
        }
      })

      socket.on('gameEnded', () => {
        setEndGame(true);
        setOverMessage('Room closing in 5 seconds.');

        setTimeout(() => {
          window.history.replaceState({}, document.title);

          const refreshKey = Math.random().toString(36).substring(2);
          navigate('/select', { state: { refreshKey } });
        }, 5000);
      })

      let attempts = 0;
      socket.on('hand', (newHand) => {
        if (!newHand.length && syncUsernames[0].strikes < 3 && attempts < 3) {
          attempts += 1;
          socket.emit('getHand', roomCode, cookies.playerId);
        } else {
          syncUsernames[0].hand = [...newHand];
          setUsernames(usernames => [...syncUsernames]);
        }
      });

      socket.on('nextTurn', (players, i, total, cardObj, reverseChange) => {

        reverse = reverseChange;
        let playersNext = applyPlayers(sortUsernames(players, i), ['turn', 'active']);
        setGameStateTimer(timerDelay);
        restartTimer(0);
        setTotal(total);
        syncTotal = total;
        played.push(cardObj);
      });

      socket.on('newRound', (players, i, username, strikes, newHand) => {
        setDisplayCountdown(false);
        players = applyPlayers(setHands(sortUsernames(players, i)));

        if (newHand) {
          syncUsernames[0].hand = [...newHand];
          setUsernames(usernames => [...syncUsernames]);
        }

        setTotal(0);
        syncTotal = 0;
        if (players[0].strikes === 3) {
          finalStrikes = 3;
          setOver(true);
          setOverMessage('You lose.');
        } else {

          restartTimer(2500);
          setGameStateTimer(timerDelay);
          setAndDisplayMessage(username, strikes);
        }
        played = [];
      });

      socket.on('gameOver', (players, i) => {
        clearTimeout(timerId);
        setDisplayCountdown(false);
        applyPlayers(setHands(sortUsernames(players, i)));
        setTotal(0);
        syncTotal = 0;
        finalStrikes = players[0].strikes;
        setOverMessage(finalStrikes === 3 ? 'You lose.' : 'Congrats! You win!');
        setOver(true);
        setGameOver(true);
        played = [];
      });

      socket.on('enterCheck', (message, first, newHand, username) => {

        if (message === 'OK') {

          if (first) {
            setCreator(true);
          } else {
            setCreator(false);
            setCreated(true);
          }

          if (username) {
            chosenName = username;
          }

          if (newHand) {
            setUsernameChoice(false);
            setOn(false);
            syncUsernames[0].hand = [...newHand];
            setUsernames(usernames => [...syncUsernames]);
          }

          setOn(true);
          setStarted(true);
          setDisplay(true);
        } else {
          navigate('/select', {state: { message }});
        }
      })

      socket.on('usernameCheck', (exists, username) => {
        setUsernameMessage(exists);
        if (!exists) {
          chosenName = username;
          setWaiting(waiting => true);
          setUsernameChoice(false);
        }
      })

      socket.on('playerId', playerId => {
        setCookies([{ name: 'playerId', value: playerId }], true)
      })

      socket.on('getPassword', () => {
        setUsernameChoice(false);
        setOn(true);
        setStarted(true);
        setEnterPassword(true);
      })

      socket.on('getGameState', (index) => {
        socket.emit('currentGameState', roomCode, cookies.playerId, syncCountdown, index);
      })

      socket.on('gotGameState', (gotCountdown, gotTotal, gotReverse, gotPlayed, waiting) => {
        console.log(waiting)
        if (!waiting) {
          reverse = gotReverse;
          played = gotPlayed ? gotPlayed : [];
          syncTotal = gotTotal || 0;
          setTotal(gotTotal || 0);
          if (gotCountdown > -1) {
            syncCountdown = gotCountdown;
            setGameStateTimer(gotCountdown);
          } else {
            setGameStateTimer(syncCountdown);
          }
          console.log('starting countdown got game state')
          setDisplayCountdown(true);
          timer();
        }
      })

      return () => {
        resetState();

        socket.off('players');
        socket.off('playerEnter');
        socket.off('gameEnded');
        socket.off('hand');
        socket.off('nextTurn');
        socket.off('newRound');
        socket.off('gameOver');
        socket.off('enterCheck');
        socket.off('usernameCheck');
        socket.off('playerId');
        socket.off('creator');
        socket.off('getPassword');
        socket.off('getGameState');
        socket.off('gotGameState');
        socket.off('startTimer');
        socket.disconnect(roomCode);
      }
    } else {
      setComputer(true);
      setDisplay(true);
      setStart(true);
      setCreator(true);
      setUsernameChoice(false);
      setOn(true);
      setStarted(true);

      return () => {
        resetState();
      }
    }
  }, []);

  if (display) {
    return (
      <>
      <DropDownComponent opponents={human ? 'humans' : 'computers'} />
      {usernameChoice ?
        <UsernameComponent saveUsername={saveUsername} usernameMessage={usernameMessage} /> :
        null}
      {start && !created ?
        <StartComponent startGame={startGame} selectBots={selectBots} opponents={human ? 'Human' : 'Computer'} /> :
        null}
      {waiting ?
        <WaitingComponent waiting={waiting}
                          players={waitingCount}
                          creator={creator}
                          roomCode={roomCode}
                          password={state.setPassword} />
        :
        null}
      <RoomModal on={on} />
      <RoundMessageModal displayMessage={displayMessage} />
      <RoundMessage displayMessage={displayMessage} >
        {message}
      </RoundMessage>
      <OverMessageModal over={over} />
      <OverMessage over={over}>
        {overMessage}
      </OverMessage>
      <GameOverButton gameOver={gameOver && creator && !endGame} top={'60%'} onClick={() => replay()} >Replay</GameOverButton>
      <GameOverButton gameOver={gameOver && creator && !endGame} top={'65%'} onClick={() => endGameFunc()} >End Game</GameOverButton>
      <MainContainer>
        <GameArea>
          <PlayerArea1>
            <Opponent botsCount={usernames.length - 1} >
            {usernames[2] ?
                <>
                {usernames.slice(1).map((bot, i) => {
                  return (
                  <BotAreaMobile row={i + 1} key={i}>
                    <ComputerComponentMap strikes={usernames[i + 1].strikes}
                                       key={i}
                                       hand={usernames[i + 1].hand}
                                       human={human}
                                       computer={computer}
                                       over={over}
                                       turn={usernames[i + 1].turn}
                                       player={i + 1}
                                       botsCount={usernames.length - 1}
                                       username={usernames[i + 1].username}
                                       displayCountdown={displayCountdown}
                                       gameStateTimer={gameStateTimer}
                                       active={usernames[i + 1].active}
                                       on={on}
                                       />
                  </BotAreaMobile>
                  )
                })}
                <BotArea>
                  <ComputerComponent strikes={usernames[2].strikes}
                                     hand={usernames[2].hand}
                                     human={human}
                                     computer={computer}
                                     over={over}
                                     turn={usernames[2].turn}
                                     player={2}
                                     username={usernames[2].username}
                                     displayCountdown={displayCountdown}
                                     gameStateTimer={gameStateTimer}
                                     active={usernames[2].active}
                                     on={on}
                                     />
                </BotArea>
                </>
                :
                <ComputerComponent strikes={usernames[1].strikes}
                                   hand={usernames[1].hand}
                                   human={human}
                                   computer={computer}
                                   over={over}
                                   turn={usernames[1].turn}
                                   player={1}
                                   username={usernames[1].username}
                                   displayCountdown={displayCountdown}
                                   gameStateTimer={gameStateTimer}
                                   active={usernames[1].active}
                                   on={on}
                                   /> }
            </Opponent>
          </PlayerArea1>
          <CenterRowArea>
            <OpponentArea column={1}>
              {usernames[2] ?
                <ComputerComponent strikes={usernames[1].strikes}
                                   hand={usernames[1].hand}
                                   human={human}
                                   computer={computer}
                                   over={over}
                                   turn={usernames[1].turn}
                                   player={1}
                                   username={usernames[1].username}
                                   displayCountdown={displayCountdown}
                                   gameStateTimer={gameStateTimer}
                                   active={usernames[1].active}
                                   on={on}
                                   /> :
                                   null}
            </OpponentArea>
            <DeckArea column={2}>
              <PlayingArea played={played}
                           deck={deck}
                           turn={usernames[0].turn}
                           displayCountdown={displayCountdown}
                           gameStateTimer={gameStateTimer}
                           playCard={playCard}
                           hand={usernames[0].hand}
                           over={over}
                           />
            </DeckArea>
            <OpponentArea column={3}>
              {usernames[3] ?
                  <ComputerComponent strikes={usernames[3].strikes}
                                     hand={usernames[3].hand}
                                     human={human}
                                     computer={computer}
                                     over={over}
                                     turn={usernames[3].turn}
                                     player={3}
                                     username={usernames[3].username}
                                     displayCountdown={displayCountdown}
                                     gameStateTimer={gameStateTimer}
                                     active={usernames[3].active}
                                     on={on}
                                     /> :
                                     null}
            </OpponentArea>
          </CenterRowArea>
          <TotalComponent total={total} />
          <PlayerArea2>
            <Player>
              <PlayerOneComponent strikes={usernames[0].strikes}
                                  hand={usernames[0].hand}
                                  turn={usernames[0].turn}
                                  playCard={playCard}
                                  username={usernames[0].username}
                                  human={human}
                                  />
            </Player>
            <ForfeitButton onClick={() => {if (usernames[0].turn) { setNewRound(0, cookies.playerId) }}} >Forfeit</ForfeitButton>
          </PlayerArea2>
        </GameArea>
        <Attribution>
          <a href='https://www.vecteezy.com/free-vector/playing-card-back'>Playing Card Back Vectors by Vecteezy</a>
        </Attribution>
      </MainContainer>
      </>
    )
  } else {
    return (
    <>
      {enterPassword ?
        <>
        <RoomModal on={on} />
        <PasswordComponent roomCode={roomCode}
                           setUsernameChoice={setUsernameChoice}
                           setEnterPassword={setEnterPassword}
                           socket={socket}
                           playerId={playerId} />
        </>
        :
        null}
    </>)
  }

}

export default AppHumans;