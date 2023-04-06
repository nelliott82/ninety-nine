import React, { useState } from 'react';
import styled from 'styled-components';

const WaitingContainer = styled.div`
  z-index: 101;
  position: absolute;
  width: 15rem;
  height: ${({ owner }) => owner ? '16rem' : '14rem'};
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

const WaitingComponent = ({ waiting, players, owner, roomCode, password }) => {

  return (
    <WaitingContainer display={waiting} owner={owner} >
      <p>Waiting on {players} more player{players > 1 ? 's' : ''}...</p>
      {owner ?
        <>
          <p>Invitation link copied</p>
          <p>to clipboard.</p>
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