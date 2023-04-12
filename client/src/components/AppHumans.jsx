import React, { useContext, useState, useEffect } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import ComputerComponent from './Computer.jsx';
import PlayingArea from './PlayingArea.jsx';
import PlayerOneComponent from './PlayerOne.jsx';
import DropDownComponent from './DropDown.jsx';
import UsernameComponent from './Username.jsx';
import StartComponent from './Start.jsx';
import WaitingComponent from './Waiting.jsx';
import TotalComponent from './Total.jsx';
import socket from '../helperFiles/socket.js';
import { getCookie, setCookies, makeCookieObject } from '../helperFiles/cookies.js';

const GlobalStyle1 = createGlobalStyle`
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

const ReplayButton = styled.button`
  width: 5rem;
  height: 2rem;
  font-size: 1em;
  visibility: ${({ gameOver }) => gameOver ? 'visible' : 'hidden'};
  position: absolute;
  left: 50%;
  top: 60%;
`

const CenterRowArea = styled.div`
  width: 100%;
  height: 15rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  @media (max-width: 1000px) {
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
  top: 50%;
  transform: translate(-50%);
  visibility: ${({over}) => over ? 'visible' : 'hidden'};
  color: red;
  font-size: 3em;
  text-align: center;
`;

const Timer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  visibility: ${({turn}) => turn ? 'visible' : 'hidden'};
  color: red;
  font-size: 3em;
  text-align: center;
`;

let navigated = false;
let timerDelay = 15;
let syncTotal = 0;
let syncCountdown = timerDelay;
let syncHand = [];
let syncUsernames = [];
let timerId;

let roundMessages = ['Begin!', 'Computer won! New round!', 'You won! New round!'];
let message;
let winner = 0;
let deck = shuffleDeck(createDeck());
let played = [];
let reverse = false;
let chosenName = 'Waiting...';
let count = 4;
let playerId = '';
let finalStrikes = 0;

const AppHumans = (props) => {
  let { state } = useLocation();
  if (!state) {
    state = {};
  }
  let navigate = useNavigate();
  let [hands, setHands] = useState([{
    0: [],
    1: [],
    2: [],
    3: []
  }])
  let [display, setDisplay] = useState(false);
  let [on, setOn] = useState(true);
  let [hand, setHand] = useState([]);
  let [opponentHand, setOpponentHand] = useState([]);
  let [turn, setTurn] = useState(0);
  let [human, setHuman] = useState(true);
  let [computer, setComputer] = useState(false);
  let [total, setTotal] = useState(0);
  let [strikes, setStrikes] = useState([0, 0, 0, 0]);
  let [over, setOver] = useState(false);
  let [gameOver, setGameOver] = useState(false);
  let [displayMessage, setDisplayMessage] = useState(false);
  let [round, setRound] = useState(0);
  let [players, setPlayers] = useState([0, 1]);
  let [opponentsArray, setOpponentsArray] = useState([1]);
  let [owner, setOwner] = useState(false);
  let [waiting, setWaiting] = useState(false);
  let [yetToJoin, setYetToJoin] = useState(4);
  let [countdown, setCountdown] = useState(timerDelay);
  let [displayCountdown, setDisplayCountdown] = useState(false);
  let [password, setPassword] = useState('');
  let [waitingCount, setWaitingCount] = useState(4);

  function timer() {
    clearTimeout(timerId);
    if (syncCountdown > 0) {
      timerId = setTimeout(() => {
        syncCountdown -= 1;
        setCountdown(countdown => countdown - 1);
        timer();
      }, 1000)
    } else {
      if (syncUsernames[0].turn) {
        playCard(syncHand[0], 0);
      }
    }
  }

  function restartTimer(delay) {
    clearTimeout(timerId);
    syncCountdown = timerDelay;
    setCountdown(countdown => timerDelay);
    setTimeout(() => {
      setDisplayCountdown(true);
      timer();
    }, delay);
  }

  const [usernameChoice, setUsernameChoice] = useState(true);
  const [usernameMessage, setUsernameMessage] = useState(false);
  const [usernames, setUsernames] = useState(new Array(4)
                                                  .fill('')
                                                  .map(() => { return { username: 'Waiting...',
                                                                        strikes: 0,
                                                                        active: false,
                                                                        turn: false } }));
  const [start, setStart] = useState(false);
  let [setStarted, started, setChose, joining, setJoining] = useOutletContext();
  let { roomCode } = useParams();


  function getCookieValues() {
    let cookies = {};

    if (document.cookie) {
      cookies = makeCookieObject();

      chosenName = cookies.username ? cookies.username : chosenName;
      playerId = cookies.playerId ? cookies.playerId : playerId;
      cookies.owner && setOwner(true);
    }

    return cookies;
  }

  function sortUsernames(playerObjects) {
    let sorted = false;

    while (!sorted) {
      console.log('chosenName: ', chosenName)
      if (playerObjects[0].username !== chosenName) {
        playerObjects.push(playerObjects.shift());
      } else {
        sorted = true;
      }
    }
    syncUsernames = [...playerObjects];

    setUsernames([...playerObjects]);
    return playerObjects;
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

  function calculateNextPlayer () {
    let setNextPlayer = false;
    let change = reverse ? -1 : 1;
    let j = setIndex(0, change);

    while (!setNextPlayer) {
      if (syncUsernames[j].strikes < 3) {
        setNextPlayer = true;
      } else {
        j = setIndex(j, change);
      }
    }

    syncUsernames[0].turn = false;
    syncUsernames[j].turn = true;
    setUsernames([...syncUsernames]);
    return syncUsernames[j].index;

    // setTurn(turn => nextPlayer);

    // if (nextPlayer !== 0) {
    //   computer(nextPlayer);
    // }
  }

  function setNewRound(player, playerId) {
    syncUsernames[player].strikes += 1;
    setUsernames([...syncUsernames]);
    let nextPlayer = calculateNextPlayer();

    socket.emit('newRound', roomCode, syncUsernames[0].index, nextPlayer, playerId, reverse);

    return true;

    // let tempStrikes = strikes;
    // let countDone = 0;

    // if (strikes[player] === 2) {
    //   tempStrikes[player] = 3;
    //   setStrikes(strikes => [...tempStrikes]);
    //   for (let i = 1; i < tempStrikes.length; i++) {
    //     if (tempStrikes[i] === 3) {
    //       countDone++;
    //     }
    //   }
    // }

    // if (countDone === players.length - 1 || tempStrikes[0] === 3) {
    //   setOver(true);
    // } else {

    //   setRound(round => round + 1);

    //   if (tempStrikes[player] < 3) {
    //     tempStrikes[player] += 1;
    //   }

    //   setStrikes(strikes => [...tempStrikes]);

    //   if (player === 0) {
    //     winner = 1;
    //   } else {
    //     winner = 0;
    //   }

    //   deck = shuffleDeck(createDeck());
    //   played = [];

    //   setTotal(total => 0);
    //   syncTotal = 0;

    //   setTurn(turn => turn = 0);

    //   startGame(player, tempStrikes);
    //}
  }

  function playCard(cardObj, player) {
    let cookies = getCookieValues();
    clearTimeout(timerId);
    let newRound = false;

    if (cardObj[0][0] === '4') {
      reverse = !reverse;

    } else if (cardObj[0][0] === 'K') {
      setTotal(total => 99);
      syncTotal = 99;

    } else {
      if (syncTotal + cardObj[1] > 99) {
        newRound = setNewRound(0, cookies.playerId);
      } else {
        setTotal(total => total += cardObj[1]);
        syncTotal += cardObj[1];
      }

    }

    if (!newRound) {
      let nextPlayer = calculateNextPlayer();
      played = [cardObj];

      socket.emit('playCard', cardObj, roomCode, reverse, syncTotal, syncUsernames[0].index, nextPlayer, cookies.playerId);

      syncCountdown = timerDelay;
      setCountdown(timerDelay);
      timer();
      // timer();

      // let tempHands = hands;
      // tempHands[player] = [...hands[player].filter(inHand => inHand[0] !== cardObj[0]), deck.shift()]
      // setHands(hands => tempHands);

      // played = [...played, cardObj];

      // if (!deck.length) {
      //   deck = shuffleDeck(played);
      //   played = [];
      // }
    }
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
    deal(strikesArr);
    setStarted(true);
    setWaiting(waiting => true);

    setCookies([{ name: 'created', value: true }]);
    socket.emit('create', roomCode, state.setPassword, usernames[0].username, players.length);

    navigator.clipboard
      .writeText(`Join me for a game of 99 here: http://localhost:99/room/${roomCode}\n\nPsst! The password is '${state.setPassword}'.`)
      .then(() => {
        console.log('Invitation link and password saved to clipboard.');
      })
      .catch(() => {
        console.log('Inivitation link and password FAILED to save to clipboard. Sorry about that.');
      });

  }

  function selectBots(e) {
    let num = parseInt(e.target.value);
    setOpponentsArray(opponentsArray => [...Array(num).keys()]);
    setPlayers(players => [...Array(num + 1).keys()]);
  }

  function setAndDisplayMessage(player = undefined, strikes) {
    let strikeOrLost = strikes < 3 ? 'got a strike' : 'lost';
    if (player === chosenName) {
      message = `You ${strikeOrLost}! New round!`;
    } else if (player) {
      message = `${player} ${strikeOrLost}! New round!`;
    } else {
      message = 'Begin!';
    }
    setDisplayMessage(displayMessage => true);
    setTimeout(() => {
      setDisplayMessage(displayMessage => false);
    }, 2000)
  }

  function saveUsername (username) {
    let cookies = getCookieValues();
    chosenName = username;
    setCookies([{ name: 'roomCode', value: roomCode }])

    if (joining) {
      console.log('got here');
      // setStarted(true);
      socket.emit('username', roomCode, username, cookies.playerId);
    } else {
      setUsernameChoice(false);
      setCookies([{ name: 'username', value: username }])
      syncUsernames = [{ username, strikes: 0, turn: true }, ...syncUsernames.slice(1)];
      setUsernames(usernames => [{ username, strikes: 0, turn: true }, ...usernames.slice(1)]);
      setStart(true);
      setOwner(true);
    }
  }

  function replay () {
    socket.emit('replay', roomCode);
  }

  useEffect(() => {
    console.log('roomCode: ', roomCode);
    console.log('state: ', state);
    let cookies = getCookieValues();
    socket.connect();

    if (cookies.hasOwnProperty('owner')) {
      setOwner(true);
      setJoining(false);
    }

    if (!state.hasOwnProperty('setPassword')) {
      //socket.connect();

      console.log('does not have setPassword');

      if (document.cookie) {

        if (cookies.playerId) {
          socket.emit('reenter', cookies.playerId, cookies.password, cookies.roomCode, cookies.username);
        } else {
          console.log('entered here 1')
          if (!cookies.owner) {
            navigated = true;
            navigate('/select', { state: { enterPassword: true, roomCode }})
          }
        }

      } else {
        // socket.connect();
        console.log('entered here 1.1')
        if (!cookies.owner) {
          navigated = true;
          navigate('/select', { state: { enterPassword: true, roomCode }})
        }
      }

    } else {
      console.log('entered here 2');
      if ((cookies.playerId && !cookies.owner) || cookies.created) {
        //setWaiting(true);
        console.log('entered here 2.1');
        socket.emit('reenter', cookies.playerId, cookies.password, cookies.roomCode, cookies.username || 'Waiting...');
      } else {
        console.log('entered here 2.2');
        socket.emit('enter', cookies.roomCode, state.setPassword, cookies.owner, cookies.playerId);
      }
    }

    socket.on('players', (players, restart) => {
      getCookieValues()
      console.log('players: ', players);
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
        restartTimer(2500);
      }
      sortUsernames(players);
      console.log('syncUsernames: ', syncUsernames);
      setOpponentsArray(opponentsArray => [...Array(players.length - 1).keys()]);
    });

    socket.on('playerReenter', (players) => {
      getCookieValues();
      players = sortUsernames(players);
      finalStrikes = players[0].strikes;
      if (finalStrikes === 3) {
        setOver(true);
      }
      setOpponentsArray(opponentsArray => [...Array(players.length - 1).keys()]);

      console.log('playerReenter players: ', players);
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
      chosenName !== 'Waiting...' && setWaiting(playerState.waiting);
      chosenName !== 'Waiting...' && setOn(playerState.waiting);
      setWaitingCount(playerState.count);

      if (((playerState.inactive === players.length - 1) && !playerState.waiting) ||
          (playerState.strikes === players.length - 1)) {
        setDisplayCountdown(false);
        setTotal(0);
        syncTotal = 0;
        setOver(true);
        !(playerState.inactive === players.length - 1) && setGameOver(true);
        played = [];
      }

    });

    let attempts = 0;
    socket.on('hand', (newHand) => {

      if (!newHand.length && syncUsernames[0].strikes < 3 && attempts < 3) {
        attempts += 1;
        socket.emit('getHand', roomCode, syncUsernames[0].index);
      } else {
        syncHand = newHand;
        setHand(hand => [...newHand]);
        setOpponentHand([1, 2, 3]);
      }
    });

    socket.on('nextTurn', (players, total, discard, reverseChange) => {

      reverse = reverseChange;
      sortUsernames(players, 'nextTurn');
      restartTimer(0);
      setTotal(total);
      syncTotal = total;
      played = [discard];
    });

    socket.on('newRound', (players, username, strikes) => {
      console.log('new round')
      setDisplayCountdown(false);
      players = sortUsernames(players);
      setTotal(0);
      syncTotal = 0;
      setRound(round => round + 1);
      if (players[0].strikes === 3) {
        finalStrikes = 3;
        setOver(true);
      } else {

        restartTimer(2500);
        setAndDisplayMessage(username, strikes);
      }
      played = [];
    });

    socket.on('gameOver', (players) => {
      console.log('game over')
      clearTimeout(timerId);
      setDisplayCountdown(false);
      players = sortUsernames(players);
      setTotal(0);
      syncTotal = 0;
      finalStrikes = players[0].strikes;
      setOver(true);
      setGameOver(true);
      played = [];
    });

    socket.on('reenterCheck', (message, username, playerId, newHand) => {
      console.log('reenterCheck')
      if (message === 'reenter') {
        if (username !== 'Waiting...') {
          setUsernameChoice(false);
        }
        setStarted(true);
        syncHand = [...newHand];
        setHand([...newHand]);
        setOpponentHand([1, 2, 3]);
        setChose(true);
        setStart(start => false);
        !cookies.owner && setJoining(joining => true);
        setDisplay(true);
      } else {
        console.log('oops: ', message);
        navigated = true;
        navigate('/select', {state: { message }});
      }
    })

    socket.on('enterCheck', (message) => {
      if (message === 'OK') {
        console.log('cool')
        setStarted(true);
        setDisplay(true);
      } else {
        console.log('enter fail: ', message);
        navigated = true;
        navigate('/select', {state: { message }});
      }
    })

    socket.on('usernameCheck', (exists, username) => {
      setUsernameMessage(exists);
      console.log('exists: ', exists);
      if (!exists) {
        chosenName = username;
        syncUsernames = [{ username, strikes: 0, turn: false }, ...syncUsernames.slice(1)];
        setUsernames(usernames => [{ username, strikes: 0, turn: false }, ...usernames.slice(1)]);
        setCookies([{ name: 'username', value: username }])
        setWaiting(waiting => true);
        setUsernameChoice(false);
      }
    })

    socket.on('playerId', playerId => {
      let cookiesObject = getCookieValues();
      setCookies([{ name: 'playerId', value: playerId }])
    })

    socket.on('owner', () => {
      setCookies([{ name: 'owner', value: true }]);
      setOwner(true);
    })

    socket.on('getGameState', (index) => {
      socket.emit('currentGameState', roomCode, syncCountdown, played[0], syncTotal, index);
    })

    socket.on('gotGameState', (gotCountdown, gotPlayed, gotTotal, gotReverse) => {
      let wait = syncUsernames.reduce((accum, player) => {
        if (player.username === 'Waiting...') {
          accum = true;
        }
        return accum;
      }, false);
      console.log('********syncUsernames: ', syncUsernames);
      console.log('********wait: ', wait);
      if (!wait) {
        reverse = gotReverse;
        syncCountdown = gotCountdown;
        played = gotPlayed ? [gotPlayed] : [];
        syncTotal = gotTotal || 0;
        setTotal(gotTotal || 0);
        setCountdown(gotCountdown);
        setDisplayCountdown(true);
        timer();
      }
    })

    return () => {
      if (!navigated) {
        let index = syncUsernames[0] ? syncUsernames[0].index : -1;
        socket.disconnect(roomCode, index);
      }
    }
  }, []);
  console.log('display: ', display);
  console.log('on: ', on);
  if (display) {
    return (
      <>
      {usernameChoice ?
        <UsernameComponent saveUsername={saveUsername} usernameMessage={usernameMessage} /> :
        start && !joining ?
          <StartComponent startGame={startGame} selectBots={selectBots} opponents={'Human'} /> :
          null
      }
      {waiting ? <WaitingComponent waiting={waiting} players={waitingCount} owner={owner} roomCode={roomCode} password={state.setPassword} /> : null}
      <RoomModal on={on} />
      <RoundMessageModal displayMessage={displayMessage} />
      <RoundMessage displayMessage={displayMessage} >
        {message}
      </RoundMessage>
      <OverMessageModal over={over} />
      <OverMessage over={over}>
        {finalStrikes === 3 ?
        <div>You lose.</div>
        :
        <div>Congrats! You win!</div>}
      </OverMessage>
      <ReplayButton gameOver={gameOver && owner} onClick={() => replay()} >Replay?</ReplayButton>
      <Timer turn={usernames[0].turn && displayCountdown && !over}>
        <div>{countdown.toString()}</div>
      </Timer>
      <MainContainer>
        <GameArea>
          <PlayerArea1>
            <Opponent botsCount={opponentsArray.length} >
            {opponentsArray[1] ?
                <>
                {opponentsArray.map((bot, i) => {
                  return (
                  <BotAreaMobile row={i + 1} key={i}>
                    <ComputerComponent strikes={usernames[i + 1].strikes}
                                      computerHand={opponentHand}
                                      human={human}
                                      computer={computer}
                                      over={over}
                                      turn={usernames[i + 1].turn}
                                      player={i + 1}
                                      botsCount={opponentsArray.length}
                                      countdown={countdown}
                                      username={usernames[i + 1].username}
                                      displayCountdown={displayCountdown}
                                      active={usernames[i + 1].active}
                                      />
                  </BotAreaMobile>
                  )
                })}
                <BotArea>
                  <ComputerComponent strikes={usernames[2].strikes}
                                    computerHand={opponentHand}
                                    human={human}
                                    computer={computer}
                                    over={over}
                                    turn={usernames[2].turn}
                                    player={2}
                                    countdown={countdown}
                                    username={usernames[2].username}
                                    displayCountdown={displayCountdown}
                                    active={usernames[2].active}
                                    />
                </BotArea>
                </>
                :
                <ComputerComponent strikes={usernames[1].strikes}
                                  computerHand={opponentHand}
                                  human={human}
                                  computer={computer}
                                  over={over}
                                  turn={usernames[1].turn}
                                  player={1}
                                  countdown={countdown}
                                  username={usernames[1].username}
                                  displayCountdown={displayCountdown}
                                  active={usernames[1].active}
                                  /> }
            </Opponent>
          </PlayerArea1>
          <CenterRowArea>
            <OpponentArea column={1}>
              {opponentsArray[1] ?
                <ComputerComponent strikes={usernames[1].strikes}
                                  computerHand={opponentHand}
                                  human={human}
                                  computer={computer}
                                  over={over}
                                  turn={usernames[1].turn}
                                  player={1}
                                  countdown={countdown}
                                  username={usernames[1].username}
                                  displayCountdown={displayCountdown}
                                  active={usernames[1].active}
                                  /> :
                                  null}
            </OpponentArea>
            <DeckArea column={2}>
              <PlayingArea played={played} deck={deck} />
            </DeckArea>
            <OpponentArea column={3}>
              {opponentsArray[2] ?
                  <ComputerComponent strikes={usernames[3].strikes}
                                    computerHand={opponentHand}
                                    human={human}
                                    computer={computer}
                                    over={over}
                                    turn={usernames[3].turn}
                                    player={3}
                                    countdown={countdown}
                                    username={usernames[3].username}
                                    displayCountdown={displayCountdown}
                                    active={usernames[3].active}
                                    /> :
                                    null}
            </OpponentArea>
          </CenterRowArea>
          <TotalComponent total={total} />
          <PlayerArea2>
            <Player>
              <PlayerOneComponent strikes={usernames[0].strikes}
                                  playerOneHand={hand}
                                  turn={usernames[0].turn}
                                  playCard={playCard}
                                  username={usernames[0].username} />
            </Player>
            <ForfeitButton onClick={() => {if (usernames[0].turn) { setNewRound(0) }}} >Forfeit</ForfeitButton>
          </PlayerArea2>
        </GameArea>
        <Attribution>
          <a href='https://www.vecteezy.com/free-vector/playing-card-back'>Playing Card Back Vectors by Vecteezy</a>
        </Attribution>
      </MainContainer>
      </>
    )
  } else {
    return <></>
  }

}

export default AppHumans;