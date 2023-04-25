import React, { useState } from 'react';
import styled from 'styled-components';

const WaitingContainer = styled.div`
  z-index: 99;
  position: absolute;
  width: 15rem;
  height: ${({ creator }) => creator ? '16rem' : '3rem'};
  border-radius: 10px;
  background-color: white;
  display: ${({ display }) => display ? 'grid' : 'none'};
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.5fr 0.7fr;
  justify-items: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CopyButton = styled.button`
  width: 10rem;
  height: 4rem;
  font-size: 1em;
`;

const WaitingComponent = ({ waiting, players, creator, roomCode, password }) => {

  function copyLink() {
    navigator.clipboard
    .writeText(`Join me for a game of 99 here: https://${window.location.host}/room/${roomCode}\n\nPsst! The password is '${password}'.`)
    .then(() => {
    })
    .catch(() => {
      alert('Invitation link and password failed to save to clipboard. Sorry about that.');
    });
  }

  return (
    <WaitingContainer display={waiting} creator={creator} >
      <p>Waiting on {players} more player{players > 1 ? 's' : ''}...</p>
      {creator ?
        <>
          <CopyButton onClick={copyLink}>Copy Invitation Link to Clipboard</CopyButton>
          <p>Room Code: {roomCode}</p>
          <p>Password: {password}</p>
        </>
        :
        null
      }
    </WaitingContainer>
    )
  }

  export default WaitingComponent;