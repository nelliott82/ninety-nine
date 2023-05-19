import React, { useContext, useState, useEffect } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import nikkoBot from '../helperFiles/computer.js';

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

let deck = shuffleDeck(createDeck());
let played = [];
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
                   newRoundDisplay,
                   on,
                   over,
                   overMessage,
                   playCard,
                   selectOpponents,
                   setAndDisplayMessage,
                   setDisplay,
                   setGameOver,
                   setNewRoundDisplay,
                   setOn,
                   setOver,
                   setOverMessage,
                   setStarted,
                   setTotal,
                   setUsernames,
                   start,
                   syncUsernames,
                   total,
                   usernames
                  }) => {

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

  function setNewRoundBot(nextPlayer, player) {

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
      setTimeout(() => {
        calculateNextPlayer(player);

        deck = shuffleDeck(createDeck());
        played = [];

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

    playCard(cardObj, player, (nextPlayer) => {
      if (nextPlayer > 0) {
        bot(nextPlayer);
      }

      syncUsernames[player].hand = [...syncUsernames[player].hand.filter(inHand => inHand[0] !== cardObj[0]), deck.shift()];
      setUsernames(usernames => [...syncUsernames]);

      if (!deck.length) {
        deck = shuffleDeck(played);
        played = [];
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
    setOn(true);
    setStarted(true);

    return () => {
      resetState();
    }
  }, []);

  return (
    <AppCentral
      creator={true}
      deck={deck}
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