import React, { useContext, useState, useEffect } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import nikkoBot from '../helperFiles/computer.js';
import AppCentral from './AppCentral.jsx';

let syncTotal = 0;
let syncUsernames = new Array(2).fill('')
                                .map(() => { return { username: 'Waiting...',
                                                      strikes: 0,
                                                      active: false,
                                                      hand: [],
                                                      turn: false } });

let deck = shuffleDeck(createDeck());
let reverse = false;
let chosenName = 'Waiting...';
let count = 4;
let finalStrikes = 0;
let frameId;
let endGame = false;

const AppBots = ({ display,
                   displayMessage,
                   endGame,
                   endGameFunc,
                   gameOver,
                   message,
                   navigate,
                   newRoundDisplay,
                   on,
                   over,
                   overMessage,
                   playCard,
                   played,
                   replay,
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

  function setNewRoundBot(player, calculateNextPlayer) {

    let countDone = syncUsernames.length;

    if (syncUsernames[player].strikes === 3) {
      for (let i = 1; i <syncUsernames.length; i++) {
        if (syncUsernames[i].strikes === 3) {
          countDone -= 1;
        }
      }
    }
    setNewRoundDisplay(newRoundDisplay => true);

    if (countDone === 1 || syncUsernames[0].strikes === 3) {
      setOver(true);
      setGameOver(true);
      let message = countDone === 1 ? 'You win!' : 'You lose!'
      setOverMessage(`Game over!\n\n${message}`);
    } else {
      setAndDisplayMessage(player, syncUsernames[player].strikes, 10000);
      syncUsernames[player].turn = false;
      setUsernames(usernames => [...syncUsernames]);

      setTimeout(() => {
        calculateNextPlayer(player);

        deck = shuffleDeck(createDeck());
        setPlayed([]);

        setTotal(total => 0);
        syncTotal = 0;

        syncUsernames.forEach(player => {
          player.turn = false;
          player.hand = [];
        });
        setUsernames(usernames => [...syncUsernames]);

        startGame(true);
      }, 10000);
    }
  }

  function bot(bot) {
    let time = syncTotal < 80 ? 3000 : 4000;
    let thinkingTime = Math.random() * time + 1000;
    setTimeout(() => {
      playCardBot(nikkoBot.chooseCard(syncUsernames[bot].hand, syncTotal), bot);
    }, thinkingTime);
  }

  function playCardBot(cardObj, player) {

    syncTotal = playCard(cardObj, player, syncTotal, (nextPlayer) => {
      if (nextPlayer > 0) {
        bot(nextPlayer);
      }

      syncUsernames[player].hand = [...syncUsernames[player].hand.filter(inHand => inHand[0] !== cardObj[0]), deck.shift()];
      setUsernames(usernames => [...syncUsernames]);

      if (!deck.length) {
        let tempPlayed = played.slice(0);
        deck = shuffleDeck(tempPlayed);
        setPlayed([]);
      }
    }, setNewRoundBot)
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

  function startGame(newRound) {
    syncUsernames.forEach((player, i) => player.index = i);
    !newRound && setAndDisplayMessage(undefined, 0, 2000);
    setOn(false);
    deal();
  }

  function replayBots() {
    replay(() => {
      setNewRoundDisplay(newRoundDisplay => false);
      setOver(false);
      setGameOver(false);
      syncUsernames.forEach(player => {
        player.strikes = 0;
        player.turn = false;
        player.hand = [];
      });
      deck = shuffleDeck(createDeck());
      setUsernames(usernames => [...syncUsernames]);
      startGame();
    })
  }

  function endGameBots() {
    endGameFunc(() => {
      const refreshKey = Math.random().toString(36).substring(2);
      navigate('/select', { state: { refreshKey } });
    })
  }

  function resetState() {
    chosenName = 'Waiting...';
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
    setOn(true);
    setStarted(true);

    return () => {
      resetState();
    }
  }, []);

  return (
    <AppCentral
      creator={true}
      display={true}
      displayMessage={displayMessage}
      endGame={endGame}
      endGameFunc={endGameBots}
      gameOver={gameOver}
      message={message}
      newRoundDisplay={newRoundDisplay}
      on={on}
      over={over}
      overMessage={overMessage}
      playCard={playCardBot}
      played={played}
      replay={replayBots}
      selectOpponents={selectOpponents}
      setNewRound={setNewRoundBot}
      start={true}
      startGame={startGame}
      total={total}
      usernames={usernames}
      usernameChoice={false}
    />
  )

}

export default AppBots;