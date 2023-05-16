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

let message;
let deck = shuffleDeck(createDeck());
let played = [];
let reverse = false;
let chosenName = 'Waiting...';
let count = 4;
let playerId = '';
let finalStrikes = 0;
let frameId;
let endGame = false;

const AppBots = (props) => {
  const navigate = useNavigate();

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

    return true;
  }

  function bot(bot) {
    let time = syncTotal < 80 ? 3000 : 4000;
    let thinkingTime = Math.random() * time + 1000;
    setTimeout(() => {
      playCard(nikkoBot.chooseCard(syncUsernames[bot].hand, syncTotal), bot);
    }, thinkingTime);
  }

  function playCard(cardObj, player) {
    let newRound = false;

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

  function setAndDisplayMessage(player, strikes, delay) {
    let strikeOrLost = strikes < 3 ? 'got a strike' : 'lost';
    let integer = Number.isInteger(player);
    if (player === chosenName || (integer && !player)) {
      message = `You ${strikeOrLost}! New round will start in: `;
    } else if (player) {
      let append = integer ? 'Computer ' : '';
      message = `${append + player}\n\n${strikeOrLost}!\n\nNew round will start in: `;
    } else {
      message = 'Begin!';
    }
    setDisplayMessage(displayMessage => true);
    setTimeout(() => {
      setDisplayMessage(displayMessage => false);
      setNewRoundDisplay(newRoundDisplay => false);
    }, delay)
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
    if (!endGame) {
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
    }
    setTotal(0);
    syncTotal = 0;
    played = [];
  }

  function endGameFunc() {
    endGame = true;
    const refreshKey = Math.random().toString(36).substring(2);
    navigate('/select', { state: { refreshKey } });
  }

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
  }, []);

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
    <RoundMessageComponent displayMessage={displayMessage} message={message} />
    <OverMessageModal over={over} />
    <OverMessage over={over}>
      {overMessage}
    </OverMessage>
    <GameOverButton gameOver={gameOver && creator && !endGame}
                    top={'50%'}
                    margin={1}
                    onClick={() => replay()} >Replay</GameOverButton>
    <GameOverButton gameOver={gameOver && creator && !endGame}
                    top={'55%'}
                    margin={2}
                    onClick={() => endGameFunc()} >End Game</GameOverButton>
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
                                        newRoundDisplay={newRoundDisplay}
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
                                    newRoundDisplay={newRoundDisplay}
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
                                  newRoundDisplay={newRoundDisplay}
                                  on={on}
                                  /> }
          </Opponent>
        </PlayerArea1>
        <CenterRowArea botsCount={usernames.length - 1}>
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
                                  newRoundDisplay={newRoundDisplay}
                                  on={on}
                                  /> :
                                  null}
          </OpponentArea>
          <DeckArea column={2}>
            <PlayingArea played={played}
                          deck={deck}
                          botsCount={usernames.length - 1}
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
                                    newRoundDisplay={newRoundDisplay}
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

}

export default AppBots;