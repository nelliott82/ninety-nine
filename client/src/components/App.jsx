import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Outlet, useParams } from 'react-router-dom';
import AppBots from './AppBots.jsx';
import AppHumans from './AppHumans.jsx';
import RoomComponent from './Room.jsx';
import DropDownComponent from './DropDown.jsx';
import ChooseOpponents from './Opponents.jsx';

export const TopContext = React.createContext();

const GlobalStyle = createGlobalStyle`
  body {
    overflow-x: hidden;
    background: #C0DCC0;
    position: relative;
  }
`;

const ChooseModal = styled.div`
  z-index: 100;
  display: 'block';
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: ${({ started }) => started ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)'};
`;

const App = () => {
  let { roomCode } = useParams();
  const [tempChoice, setTempChoice] = useState('');
  const [opponents, setOpponents] = useState(tempChoice);
  const [joining, setJoining] = useState(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [roomCode1, setRoomCode1] = useState('');

  function chooseOpponents(opponentsChoice) {
    setOpponents(opponentsChoice);
  }

  function saveRoomCode (generatedRoomCode) {
    setRoomCode1(roomCode1 => generatedRoomCode);
    console.log('roomCode after save: ', roomCode1);
  }

  useEffect(() => {
    if (roomCode) {
      setOpponents('humans');
      setReady(true);
    }
  }, [])

  return (
    <>
      <GlobalStyle/>
      <DropDownComponent/>
      <ChooseModal started={started} >

        <ChooseOpponents chooseOpponents={chooseOpponents} setReady={setReady} setRoomCode1={setRoomCode1} />

          {opponents === 'humans' && ready ?
            <Outlet context={[setStarted, joining, roomCode, setJoining, setReady, setRoomCode1, roomCode1]} /> :
            null
          }
          {opponents === 'computers' ?
            <AppBots setStarted={setStarted}/> :
            null
          }

      </ChooseModal>
    </>
  )
}

export default App;