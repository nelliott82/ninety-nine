import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
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

const ChooseModal = styled.div`
  z-index: 100;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: ${({ started }) => started ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)'};
`;


const App = () => {
  let { roomCode } = useParams();
  const [chose, setChose] = useState(false);
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
      console.log('roomCode found in App');
      setOpponents('humans');
      setReady(true);
      setChose(true);
    }
  }, [])

  return (
    <>
      <GlobalStyle/>
      <DropDownComponent/>
      <ChooseModal started={started} >

        <ChooseOpponents chooseOpponents={chooseOpponents}
                         setReady={setReady}
                         setRoomCode1={setRoomCode1}
                         setChose={setChose}
                         chose={chose}
                         />

          {opponents === 'humans' && ready ?
            <Outlet context={[setStarted, started, setChose, joining, setJoining, setReady, setRoomCode1, roomCode1]} /> :
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