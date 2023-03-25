import React, { useState } from 'react';
import styled from 'styled-components';

const StartContainer = styled.div`
  z-index: 101;
  position: absolute;
  width: 15rem;
  height: 14rem;
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

const BotsDropDownLabel = styled.div`
  grid-row: 1;
  width: 7rem;
  height: 4rem;
  font-size: 1.5em;
  text-align: center;
`;

const BotsDropDown = styled.select`
  grid-row: 2;
  width: 5rem;
  height: 2rem;
  font-size: 1.5em;
`;

const StartButton = styled.button`
  grid-row: 3;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

const WaitingComponent = ({ waiting, players }) => {

  return (
    <StartContainer display={waiting} >
      Waiting on {players} more player{players > 1 ? 's' : ''}...
    </StartContainer>
    )
  }

  export default WaitingComponent;