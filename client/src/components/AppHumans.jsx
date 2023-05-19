import React, { useContext, useState, useEffect } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import socket from '../helperFiles/socket.js';
import { setCookies, makeCookieObject } from '../helperFiles/cookies.js';
import AppCentral from './AppCentral.jsx';

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

let reverse = false;
let chosenName = 'Waiting...';
let count = 4;
let playerId = '';
let finalStrikes = 0;
let frameId;

const AppHumans = ({ display,
                     displayMessage,
                     endGame,
                     endGameFunc,
                     gameOver,
                     location,
                     message,
                     navigate,
                     newRoundDisplay,
                     on,
                     over,
                     overMessage,
                     playCard,
                     played,
                     selectOpponents,
                     setAndDisplayMessage,
                     setDisplay,
                     setGameOver,
                     setNewRoundDisplay,
                     setOn,
                     setOver,
                     setOverMessage,
                     setPlayed,
                     setStarted,
                     setTotal,
                     setUsernames,
                     syncUsernames,
                     total,
                     usernames
                    }) => {
  let { state } = location;
  if (!state) {
    state = {};
  }

  const [created, setCreated] = useState(false);
  const [creator, setCreator] = useState(false);
  const [displayCountdown, setDisplayCountdown] = useState(false);
  const [enterPassword, setEnterPassword] = useState(false);
  const [gameStateTimer, setGameStateTimer] = useState(timerDelay);
  const [human, setHuman] = useState(false);
  const [start, setStart] = useState(false);
  const [usernameChoice, setUsernameChoice] = useState(true);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [waitingCount, setWaitingCount] = useState(4);

  const { roomCode } = useParams();
  const cookies = makeCookieObject();

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

  function setNewRoundHuman(player, calculateNextPlayer) {
    syncUsernames[player].turn = false;
    setUsernames(usernames => [...syncUsernames]);

    socket.emit('newRound', roomCode, syncUsernames[0].index, calculateNextPlayer(player), cookies.playerId, reverse);
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
    setUsernameTaken(false);
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
        setPlayed([]);
      }
    })

    socket.on('gameEnded', () => {
      setEndGame(true);
      setOverMessage('Room closing in 5 seconds.');

      setTimeout(() => {
        syncTotal = 0;
        setPlayed([]);
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
      let tempPlayed = played.slice(0);
      tempPlayed.push(cardObj);
      setPlayed([...tempPlayed]);
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
        setPlayed([]);
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
      setUsernameTaken(exists);
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
        gotPlayed ? setPlayed([...gotPlayed]) : setPlayed([]);
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
      created={created}
      creator={creator}
      display={display}
      displayCountdown={displayCountdown}
      displayMessage={displayMessage}
      endGame={endGame}
      endGameFunc={endGameHuman}
      enterPassword={enterPassword}
      gameOver={gameOver}
      gameStateTimer={gameStateTimer}
      human={human}
      message={message}
      newRoundDisplay={newRoundDisplay}
      on={on}
      over={over}
      overMessage={overMessage}
      playCard={playCardHuman}
      played={played}
      playerId={cookies.playerId}
      replay={replayHuman}
      roomCode={roomCode}
      saveUsername={saveUsername}
      selectOpponents={selectOpponents}
      setEnterPassword={setEnterPassword}
      setNewRound={setNewRoundHuman}
      setPassword={state.setPassword}
      setUsernameChoice={setUsernameChoice}
      socket={socket}
      start={start}
      startGame={startGame}
      total={total}
      usernameChoice={usernameChoice}
      usernames={usernames}
      usernameTaken={usernameTaken}
      waiting={waiting}
      waitingCount={waitingCount}
    />
  )

}

export default AppHumans;