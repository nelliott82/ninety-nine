import React, { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import AppBots from './AppBots.jsx';
import AppHumans from './AppHumans.jsx';

const AppSplit = () => {
  const location = useLocation();

  const [display, setDisplay] = useState(false);
  const [on, setOn] = useState(true);
  const [human, setHuman] = useState(false);
  const [computer, setComputer] = useState(false);
  const [total, setTotal] = useState(0);
  const [over, setOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
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


  function resetState() {
    reverse = false;
    finalStrikes = 0;
    syncTotal = 0;
    played = [];
    syncUsernames = new Array(2).fill('')
                                .map(() => { return { username: 'Waiting...',
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

    return () => {
      //clean up state
    }
  }, [])

  return (
    <>
      {location.pathname === '/computers' ?
        <AppBots />
        :
        <AppHumans />}
    </>
  )
}

export default AppSplit;