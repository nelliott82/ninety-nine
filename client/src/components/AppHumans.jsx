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
import RoundMessageComponent from './RoundMessage.jsx';
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
  @media (max-width: 1000px) {
    margin-top: 0px;
  }
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
  display: inline-block;
  font-size: 4vh;
  visibility: ${({ gameOver }) => gameOver ? 'visible' : 'hidden'};
  position: absolute;
  left: 50%;
  margin-top: ${({ margin }) => margin + 'rem' };
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
    grid-template-columns: 1fr 0fr 1fr;
    height: ${({ botsCount }) => botsCount > 2 ? '9.5rem' : '11.5rem'};
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
let syncUsernames = new Array(2).fill('')
                                .map(() => { return { username: 'Waiting...',
                                                      strikes: 0,
                                                      active: false,
                                                      hand: [],
                                                      turn: false } });

let message;
let deck = shuffleDeck(createDeck());
let played = [];
let reverse = false;
let chosenName = 'Waiting...';
let count = 4;
let playerId = '';
let finalStrikes = 0;
let frameId;

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
  const [usernames, setUsernames] = useState(syncUsernames);
  const [start, setStart] = useState(false);
  const [newRoundDisplay, setNewRoundDisplay] = useState(false);
  const [created, setCreated] = useState(false);
  const [creator, setCreator] = useState(false);
  const [setStarted, started] = useOutletContext();
  let { roomCode } = useParams();

  function timer () {
    const endTime = new Date().getTime() + 1000 + (syncCountdown * 1000);

    function showTime() {
      const currentTime = new Date().getTime();
      const remainingTime = endTime - currentTime;
      const seconds = Math.floor((remainingTime / 1000) % 60);

      syncCountdown = seconds;

      if (remainingTime >= 1000 && syncCountdown > 0) {
        frameId = requestAnimationFrame(showTime);
      } else if (syncCountdown === 0) {
        syncCountdown = 15;
      }
    }

    frameId = requestAnimationFrame(showTime);
  }

  function restartTimer(delay, start = timerDelay) {
    syncCountdown = start;
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

  function setNewRoundHuman(nextPlayer) {
    socket.emit('newRound', roomCode, syncUsernames[0].index, nextPlayer, cookies.playerId, reverse);
  }

  function playCardHuman(cardObj, player) {

    playCard(cardObj, player, (nextPlayer) => {
      socket.emit('playCard', cardObj, roomCode, reverse, syncTotal, syncUsernames[0].index, nextPlayer, cookies.playerId);
      cancelAnimationFrame(frameId);
      restartTimer(0);
      setGameStateTimer(gameStateTimer => timerDelay);
    }, setNewRoundHuman);
  }

  function startGame(newRound) {
    setWaiting(waiting => true);
    socket.emit('create', roomCode, cookies.playerId, state.setPassword, usernames[0].username, usernames.length);
  }

  function selectOpponents(e) {
    let num = parseInt(e.target.value);
    syncUsernames = [...syncUsernames.slice(0, 1), ...Array(num).fill('')
                                                                .map(() => { return { username: 'Waiting...',
                                                                                      strikes: 0,
                                                                                      active: false,
                                                                                      hand: [],
                                                                                      turn: false } })]

    setUsernames(usernames => [...syncUsernames]);
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

  function replayHuman() {
    replay(() => {
      socket.emit('replay', roomCode, cookies.playerId);
    })
  }

  function endGameHuman() {
    endGameFunc(() => {
      socket.emit('endGame', roomCode, cookies.playerId);
    })
  }

  function resetState() {
    chosenName = 'Waiting...'
    reverse = false;
    finalStrikes = 0;
    syncTotal = 0;
    played = [];
    syncUsernames = new Array(2).fill('')
                                .map(() => { return { username: chosenName,
                                                      strikes: 0,
                                                      active: false,
                                                      hand: [],
                                                      turn: false } });
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
    setUsernames(syncUsernames);
    setStart(false);
    setNewRoundDisplay(false);
    setCreated(false);
    setCreator(false);
  }

  useEffect(() => {
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
      setNewRoundDisplay(newRoundDisplay => false);

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
        setAndDisplayMessage(undefined, 0, 2000);
        setGameStateTimer(timerDelay);
        cancelAnimationFrame(frameId);
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
        syncTotal = 0;
        played = [];
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
      setGameStateTimer(gameStateTimer => timerDelay);
      cancelAnimationFrame(frameId);
      restartTimer(0);
      setTotal(total);
      syncTotal = total;
      played.push(cardObj);
    });

    socket.on('newRound', (players, oldHands, i, username, strikes, newHand, currentStrikes) => {
      setDisplayCountdown(false);
      setNewRoundDisplay(newRoundDisplay => true);
      applyPlayers(sortUsernames(oldHands, i));
      setTimeout(() => {
        players = applyPlayers(setHands(sortUsernames(players, i)));
        if (newHand) {
          syncUsernames[0].hand = [...newHand];
          setUsernames(usernames => [...syncUsernames]);
        }
      }, 10500);

      if (currentStrikes === 3) {
        finalStrikes = 3;
        setOver(true);
        setOverMessage('You lose.');
        setTimeout(() => { setNewRoundDisplay(newRoundDisplay => false) }, 10500);
      } else {
        cancelAnimationFrame(frameId);
        restartTimer(10500);
        setGameStateTimer(gameStateTimer => timerDelay);
        setAndDisplayMessage(username, strikes, 10000);
      }
      setTimeout(() => {
        setTotal(0);
        syncTotal = 0;
        played = [];
      }, 10500);
    });

    socket.on('gameOver', (players, i) => {
      setDisplayCountdown(false);
      setNewRoundDisplay(newRoundDisplay => true);
      players = applyPlayers(sortUsernames(players, i));
      finalStrikes = players[0].strikes;
      setOverMessage(finalStrikes === 3 ? 'You lose.' : 'Congrats! You win!');
      setOver(true);
      setGameOver(true);
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
      if (!waiting) {
        reverse = gotReverse;
        played = gotPlayed ? gotPlayed : [];
        syncTotal = gotTotal || 0;
        setTotal(gotTotal || 0);
        if (gotCountdown > -1) {
          cancelAnimationFrame(frameId);
          restartTimer(0, gotCountdown);
          setGameStateTimer(gameStateTimer => gotCountdown);
        } else {
          setGameStateTimer(gameStateTimer => syncCountdown);
        }
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
  }, []);

  return (
    <AppCentral
      displayMessage={displayMessage}
      endGameFunc={endGameHuman}
      message={message}
      playCard={playCardHuman}
      replay={replayHuman}
      selectOpponents={selectOpponents}
    />
  )

}

export default AppHumans;