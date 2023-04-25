import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from 'styled-components';
import socket from '../helperFiles/socket.js';

const ChooseContainer = styled.div`
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  border-radius: 10px;
  display: ${({ choose }) => choose ? 'none' : 'grid'};
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

let roomCodeHolder;

const ChooseOpponents = ({ setReady, setChooseOpponents, setChooseRoom, setRoomCodeApp }) => {
  const [opponents, setOpponents] = useState('');
  const [choose, setChoose] = useState(false);
  let [setStarted] = useOutletContext();
  const navigate = useNavigate();

  function handleChange (e) {
    setOpponents(e.target.value);
  }

  function confirmChoice () {
    setChoose(true);
    if (opponents === 'computers') {
      setOpponents('');
      socket.emit('deleteRoomCode', roomCodeHolder);
      socket.disconnect();
      setChooseOpponents(false);
      setReady(true);
      navigate('/computers');
    } else {
      setOpponents('');
      setChooseOpponents(false);
      setChooseRoom(true);
    }
  }

  useEffect(() => {
    setStarted(false);
    socket.connect();

    socket.on('roomCode', (roomCode) => {
      roomCodeHolder = roomCode;
      setRoomCodeApp(roomCode);
    })

    socket.emit('getRoomCode');
    return () => {
      socket.off('roomCode')
    }
  }, [])

  return (
    <ChooseContainer choose={choose}>
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