import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AppBots from './AppBots.jsx';
import AppHumans from './AppHumans.jsx';
import RoomComponent from './Room.jsx';
import DropDownComponent from './DropDown.jsx';
import ChooseOpponents from './Opponents.jsx';

const GlobalStyle = createGlobalStyle`
  body {
    background: #C0DCC0;
  }
`;

const ChooseModal = styled.div`
  z-index: 100;
  display: ${({ started }) => started ? 'none' : 'block'};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
`;

const App = () => {
  const [tempChoice, setTempChoice] = useState('');
  const [opponents, setOpponents] = useState(tempChoice);
  const [joining, setJoining] = useState(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  function chooseOpponents(opponentsChoice) {
    setOpponents(opponentsChoice);
  }

  return (
    <>
      <GlobalStyle/>
      <DropDownComponent/>
      <ChooseModal started={started} >

        <ChooseOpponents chooseOpponents={chooseOpponents} />

        {opponents === 'humans' ?
          <RoomComponent setJoining={setJoining} setReady={setReady} /> :
          null}

      </ChooseModal>

      {opponents === 'humans' && ready ?
        <AppHumans setStarted={setStarted} joining={joining} /> :
        null
      }
      {opponents === 'computers' ?
        <AppBots setStarted={setStarted}/> :
        null}
    </>
  )
}

export default App;