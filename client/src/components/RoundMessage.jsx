import React, { useContext, useState, useEffect } from 'react';
import {shuffleDeck, createDeck} from '../helperFiles/deck.js';
import styled, { keyframes } from 'styled-components';

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


const RoundMessageModal = styled.div`
  z-index: 99;
  visibility: ${({displayMessage}) => displayMessage ? 'visible' : 'hidden'};
  animation: ${({displayMessage}) => displayMessage ? fadeIn : fadeOut} 0.5s linear;
  transition: visibility 0.5s linear;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
`;

const RoundMessage = styled.div`
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
  width: 90vw;
`;

const NewRoundTimer = styled.div`
  visibility: ${({message}) => {
    if (message !== 'Begin!' && message) {
      return 'visible'
    } else {
      return 'hidden'
    }
  }};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  color: red;
  text-align: center;
  font-size: 3em;
  width: 80vw;
`;

let syncCountdown = 11;

let RoundMessageComponent = ({ displayMessage, message }) => {
  // let [animate, setAnimate] = useState(false);
  const [countdown, setCountdown] = useState(11);

  function timer () {
    const endTime = new Date().getTime() + 11000;

    function showTime() {
      const currentTime = new Date().getTime();
      const remainingTime = endTime - currentTime;
      const seconds = Math.floor((remainingTime / 1000) % 60);

      syncCountdown = seconds;
      setCountdown(seconds);

      if (remainingTime >= 1000 && syncCountdown > 0) {
        requestAnimationFrame(showTime);
      } else if (syncCountdown === 0) {
        syncCountdown = 11;
      }
    }

    requestAnimationFrame(showTime);
  }

  useEffect(() => {
      // setTimeout(() => setAnimate(true), 500);
      setCountdown(countdown => 11);
      syncCountdown = 11;

      if (message !== 'Begin!' && displayMessage) {
        timer();
      }
      return () => {
        syncCountdown = 11;
        setCountdown(countdown => 11);
      }
    }, [displayMessage, message]);

  return (
    <RoundMessageModal displayMessage={displayMessage}>
      <RoundMessage displayMessage={displayMessage} >
        {message}{message !== 'Begin!' && message ? countdown : null}
      </RoundMessage>
    </RoundMessageModal>
  )
}

export default RoundMessageComponent;