import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AppBots from './AppBots.jsx';
import AppHumans from './AppHumans.jsx';
import DropDownComponent from './DropDown.jsx';
import ChooseOpponents from './Opponents.jsx';

const GlobalStyle = createGlobalStyle`
  body {
    background: #C0DCC0;
  }
`;

const ChooseModal = styled.div`
  z-index: 100;
  display: ${({ chose }) => (chose ? 'none' : 'block')};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
`;

var App = () => {
  var [tempChoice, setTempChoice] = useState('');
  var [opponents, setOpponents] = useState(tempChoice);
  var [chose, setChose] = useState(false);

  function chooseOpponents() {
    if (tempChoice) {
      setChose(true);
      setOpponents(tempChoice);
    }
  }

  function selectOpponents(e) {
    let opponentsChoice = e.target.value;
    setTempChoice(opponentsChoice);
    console.log(e.target.value);
  }

  return (
    <>
      <GlobalStyle/>
      <DropDownComponent/>
      <ChooseModal chose={chose} >
        <ChooseOpponents chooseOpponents={chooseOpponents} selectOpponents={selectOpponents} />
      </ChooseModal>
      {opponents === 'humans' ? <AppHumans/> : opponents === 'computers' ? <AppBots/> : null}
    </>
  )
}

export default App;