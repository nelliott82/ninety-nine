import React, { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import AppBots from './AppBots.jsx';
import AppHumans from './AppHumans.jsx';

let chosenName = 'Waiting...'
let played = [];
let reverse = false;
let syncEndGame = false;
let syncTotal = 0;
let syncUsernames = new Array(2).fill('')
                                .map(() => { return { username: chosenName,
                                                      strikes: 0,
                                                      active: false,
                                                      hand: [],
                                                      turn: false } });

const AppSplit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [usernameMessage, setUsernameMessage] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [usernames, setUsernames] = useState(syncUsernames);

  const [display, setDisplay] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [newRoundDisplay, setNewRoundDisplay] = useState(false);
  const [on, setOn] = useState(true);
  const [over, setOver] = useState(false);
  const [overMessage, setOverMessage] = useState(false);
  const [start, setStart] = useState(false);
  const [total, setTotal] = useState(0);

  const [setStarted, started] = useOutletContext();

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

  function playCard(cardObj, player, nextTurnCallback, setNewRoundCallback) {
    let newRound = false;

    if (cardObj[0][0] === '4') {
      reverse = !reverse;

    } else if (cardObj[0][0] === 'K') {
      setTotal(total => 99);
      syncTotal = 99;

    } else {
      if (syncTotal + cardObj[1] > 99) {
        newRound = false;
      } else {
        setTotal(total => total += cardObj[1]);
        syncTotal += cardObj[1];
      }

    }

    let nextPlayer = calculateNextPlayer(player);

    if (!newRound) {
      played.push(cardObj);

      nextTurnCallback(nextPlayer);

    } else {
      syncUsernames[player].strikes += 1;
      setUsernames(usernames => [...syncUsernames]);

      setNewRoundCallback(nextPlayer, player);
    }
  }

  function selectOpponents(e) {
    let num = parseInt(e.target.value);
    syncUsernames = [...syncUsernames.slice(0, 1), ...Array(num).fill('')
                                                                .map(() => { return { username: chosenName,
                                                                                      strikes: 0,
                                                                                      active: false,
                                                                                      hand: [],
                                                                                      turn: false } })]

    setUsernames(usernames => [...syncUsernames]);
  }

  function setAndDisplayMessage(player, strikes, delay) {
    let strikeOrLost = strikes < 3 ? 'got a strike' : 'lost';
    let integer = Number.isInteger(player);
    if (player === chosenName || (integer && !player)) {
      setMessage(`You ${strikeOrLost}! New round will start in: `);
    } else if (player) {
      let append = integer ? 'Computer ' : '';
      setMessage(`${append + player}\n\n${strikeOrLost}!\n\nNew round will start in: `);
    } else {
      setMessage('Begin!');
    }
    setDisplayMessage(displayMessage => true);
    setTimeout(() => {
      setDisplayMessage(displayMessage => false);
      setNewRoundDisplay(newRoundDisplay => false);
    }, delay)
  }

  function endGameFunc(callback) {
    syncEndGame = true;
    setEndGame(true);
    callback()
  }

  function replay(callback) {
    if (!syncEndGame) {
      setTotal(0);
      syncTotal = 0;
      played = [];
      callback();
    }
  }

  function resetState() {
    chosenName = 'Waiting...'
    reverse = false;
    finalStrikes = 0;
    syncTotal = 0;
    played = [];
    syncEndGame = false;
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

    return () => {
      //clean up state
    }
  }, [])

  return (
    <>
      {location.pathname === '/computers' ?
        <AppBots
          display={display}
          displayMessage={displayMessage}
          endGame={endGame}
          endGameFunc={endGameFunc}
          gameOver={gameOver}
          message={message}
          newRoundDisplay={newRoundDisplay}
          on={on}
          over={over}
          overMessage={overMessage}
          playCard={playCard}
          selectOpponents={selectOpponents}
          setAndDisplayMessage={setAndDisplayMessage}
          setDisplay={setDisplay}
          setGameOver={setGameOver}
          setNewRoundDisplay={setNewRoundDisplay}
          setOn={setOn}
          setOver={setOver}
          setOverMessage={setOverMessage}
          setStarted={setStarted}
          setTotal={setTotal}
          setUsernames={setUsernames}
          start={start}
          syncUsernames={syncUsernames}
          total={total}
          usernames={usernames}
        />
        :
        <AppHumans
          display={display}
          displayMessage={displayMessage}
          endGame={endGame}
          endGameFunc={endGameFunc}
          gameOver={gameOver}
          location={location}
          message={message}
          newRoundDisplay={newRoundDisplay}
          on={on}
          over={over}
          overMessage={overMessage}
          playCard={playCard}
          selectOpponents={selectOpponents}
          setAndDisplayMessage={setAndDisplayMessage}
          setDisplay={setDisplay}
          setGameOver={setGameOver}
          setNewRoundDisplay={setNewRoundDisplay}
          setOn={setOn}
          setOver={setOver}
          setOverMessage={setOverMessage}
          setStart={setStart}
          setStarted={setStarted}
          setTotal={setTotal}
          setUsernames={setUsernames}
          start={start}
          syncUsernames={syncUsernames}
          total={total}
          usernames={usernames}
        />}
    </>
  )
}

export default AppSplit;