import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Outlet, useOutletContext, useParams, useLocation } from 'react-router-dom';
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
    background: #C0DCC0;
    position: relative;
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

const MessageContainer = styled.div`
  z-index: 101;
  position: absolute;
  visibility: ${({displayMessage}) => displayMessage ? 'visible' : 'hidden'};
  animation: ${({displayMessage}) => displayMessage ? fadeIn : fadeOut} 0.5s linear;
  transition: visibility 0.5s linear;
  width: 15rem;
  height: 3rem;
  border-radius: 10px;
  background-color: white;
  justify-items: center;
  align-items: center;
  text-align: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;


const App = () => {
  let { roomCode } = useParams();
  const location = useLocation();
  const [tempChoice, setTempChoice] = useState('');
  const [message, setMessage] = useState('');
  const [displayMessage, setDisplayMessage] = useState(false);
  const [display, setDisplay] = useState(false);
  const [chooseOpponents, setChooseOpponents] = useState(false);
  const [chooseRoom, setChooseRoom] = useState(false);
  const [ready, setReady] = useState(false);
  const [opponents, setOpponents] = useState(tempChoice);
  const [started, setStarted] = useState(false);
  const [roomCodeApp, setRoomCodeApp] = useState('');

  function setAndDisplayMessage() {
    setDisplayMessage(true);
    setTimeout(() => {
      setDisplayMessage(displayMessage => false);
    }, 2000);
    setTimeout(() => {
      setChooseOpponents(true);
    }, 2500)
  }

  useEffect(() => {

    if (location.state && (location.state.refreshKey || location.state.message)) {
      window.history.replaceState({}, document.title);
      if (location.state.message) {
        setAndDisplayMessage();
        setMessage(location.state.message);
      }
      location.state.refreshKey && setChooseOpponents(true);
      setChooseRoom(false);
      setOpponents(tempChoice);
      setReady(false);
      setRoomCodeApp('');
    } else {
      setChooseOpponents(true);
    }
  }, [])

  return (
    <>
      <MessageContainer displayMessage={displayMessage}>
        <p>{message}</p>
      </MessageContainer>

      {chooseOpponents ?
      <ChooseOpponents setReady={setReady}
                        setChooseOpponents={setChooseOpponents}
                        setChooseRoom={setChooseRoom}
                        setRoomCodeApp={setRoomCodeApp}
                        />
      :
      null}

      {chooseRoom ?
      <Room roomCodeApp={roomCodeApp}
            setChooseRoom={setChooseRoom}
            setReady={setReady}
            />
      :
      null}
    </>
  )
}

export default App;