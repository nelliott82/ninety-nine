import React, { useContext, useState, useEffect } from 'react';
import { useOutletContext, useParams, useLocation, useNavigate } from 'react-router-dom';
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

let deck = [1];

const AppCentral = ({ created,
                      creator,
                      display,
                      displayCountdown,
                      displayMessage,
                      endGame,
                      endGameFunc,
                      gameOver,
                      gameStateTimer,
                      human,
                      message,
                      newRoundDisplay,
                      on,
                      over,
                      overMessage,
                      playCard,
                      played,
                      playerId,
                      replay,
                      roomCode,
                      saveUsername,
                      selectOpponents,
                      setEnterPassword,
                      setNewRound,
                      setPassword,
                      setUsernameChoice,
                      socket,
                      start,
                      startGame,
                      total,
                      usernameChoice,
                      usernameMessage,
                      usernames,
                      waiting,
                      waitingCount
                      }) => {

  if (display) {
    return (
      <>
      <DropDownComponent opponents={human ? 'humans' : 'computers'} />
      {usernameChoice ?
        <UsernameComponent saveUsername={saveUsername} usernameTaken={usernameTaken} /> :
        null}
      {start && !created ?
        <StartComponent startGame={startGame} selectOpponents={selectOpponents} opponents={human ? 'Human' : 'Computer'} /> :
        null}
      {waiting ?
        <WaitingComponent waiting={waiting}
                          players={waitingCount}
                          creator={creator}
                          roomCode={roomCode}
                          password={setPassword} />
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
            <ForfeitButton onClick={() => {if (usernames[0].turn) { setNewRound(0, playerId) }}} >Forfeit</ForfeitButton>
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

export default AppCentral;