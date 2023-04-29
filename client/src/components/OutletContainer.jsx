import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Outlet, useParams, useLocation, useNavigate } from 'react-router-dom';
import AppBots from './AppBots.jsx';
import AppHumans from './AppHumans.jsx';
import RoomComponent from './Room.jsx';
import DropDownComponent from './DropDown.jsx';
import ChooseOpponents from './Opponents.jsx';
import Room from './Room.jsx';
import socket from '../helperFiles/socket.js';

export const TopContext = React.createContext();

const GlobalStyle = createGlobalStyle`
  body {
    overflow-x: hidden;
    background: #93CAED;
    position: relative;
  }
`;

const Container = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`;

const ChooseModal = styled.div`
  overflow-y: auto;
  z-index: 99;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: ${({ started }) => started ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)'};
`;

const OutletContainer = () => {
  let { roomCode } = useParams();
  const location = useLocation();
  const [tempChoice, setTempChoice] = useState('');
  const [chooseOpponents, setChooseOpponents] = useState(true);
  const [chooseRoom, setChooseRoom] = useState(false);
  const [ready, setReady] = useState(false);
  const [opponents, setOpponents] = useState(tempChoice);
  const [started, setStarted] = useState(false);
  const [roomCodeApp, setRoomCodeApp] = useState('');

  return (
    <>
      <GlobalStyle/>
      <ChooseModal started={started}>
        <Container>
          <Outlet context={[setStarted, started, setReady, setRoomCodeApp, roomCodeApp, opponents, setOpponents]} />
        </Container>
      </ChooseModal>
    </>
  )
}

export default OutletContainer;