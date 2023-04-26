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
    ${'' /* background: #C0DCC0; */}
    position: relative;
    background-color: #b4b4b4;
    background-image: -webkit-linear-gradient(200deg, #f0f0f0 0%, #b4b4b4 90%);
    background-image: linear-gradient(200deg, #f0f0f0 0%, #b4b4b4 90%);
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

const Container = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomCode) {
      navigate('/select');
    }
    // socket.connect();

    // if (roomCode) {
    //   setOpponents('humans');
    //   setChooseOpponents(false);
    //   setStarted(true);
    //   setReady(true);
    // }
    // if (location.state && location.state.refreshKey) {
    //   window.history.replaceState({}, document.title);
    //   setStarted(true);
    //   setChooseOpponents(true);
    //   setChooseRoom(false);
    //   setOpponents(tempChoice);
    //   setReady(false);
    //   setRoomCodeApp('');
    // }
  }, [])

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