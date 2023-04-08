import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import socket from '../helperFiles/socket.js';

const ChooseContainer = styled.div`
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  display: ${({ chose }) => chose ? 'none' : 'grid'};
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.5fr 0.7fr;
  justify-items: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const OpponentsDropDownLabel = styled.div`
  grid-row: 1;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
  text-align: center;
`;

const OpponentsDropDown = styled.select`
  grid-row: 2;
  width: 10rem;
  height: 2rem;
  font-size: 1.5em;
`;

const ChooseButton = styled.button`
  grid-row: 3;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

const ChooseOpponents = ({ setChose, chose, chooseOpponents, setReady, setRoomCode1 }) => {
  const [opponents, setOpponents] = useState('');
  const navigate = useNavigate();
  let roomCodeHolder;

  function handleChange (e) {
    setOpponents(e.target.value);
    if (e.target.value === 'humans') {
      socket.connect();

      socket.emit('getRoomCode');
    }
  }

  function confirmChoice () {
    setChose(true);
    chooseOpponents(opponents);
    if (opponents === 'computers') {
      socket.emit('deleteRoomCode', roomCodeHolder);
      socket.disconnect();
    } else {
      setReady(true);
      navigate('/select');
    }
  }

  useEffect(() => {
    socket.on('roomCode', (roomCode) => {
      roomCodeHolder = roomCode;
      setRoomCode1(roomCode);
    })
  }, [])

  return (
    <ChooseContainer chose={chose}>
      <OpponentsDropDownLabel>Choose Your Opponents:</OpponentsDropDownLabel>
      <OpponentsDropDown onChange={(e) => handleChange(e)}>
        <option value='' >-</option>
        <option value='computers' >Computers</option>
        <option value='humans' >Humans</option>
      </OpponentsDropDown>
      <ChooseButton onClick={() => opponents && confirmChoice()}>Confirm Choice</ChooseButton>
    </ChooseContainer>
    )
  }

  export default ChooseOpponents;