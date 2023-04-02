import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import styled from 'styled-components';
import { deleteCookie } from '../helperFiles/cookies.js';
import socket from '../helperFiles/socket.js';

const RoomChoiceContainer = styled.div`
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  display: ${({ roomChoice }) => roomChoice ? 'none' : 'grid'};
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 0.5fr 1fr;
  justify-items: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CodeInput = styled.div`
  grid-row: 1;
  justify-items: center;
  align-items: center;
`;

const PasswordInput = styled.div`
  grid-row: 2;
  justify-items: center;
  align-items: center;
`;

const PasswordMsg = styled.p`
  grid-row: 3;
`;

const RoomButton = styled.button`
  grid-row: ${({ row }) => row};
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

const RoomComponent = () => {
  const [join, setJoin] = useState(false);
  const [roomChoice, setRoomChoice] = useState(false);
  const [givenRoomCode, setGivenRoomCode] = useState('');
  const [givenPassword, setGivenPassword] = useState('');
  const [create, setCreate] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const navigate = useNavigate();
  let [setStarted, joining, roomCode, setJoining, setReady, setRoomCode1, roomCode1] = useOutletContext();

  function handleChange (e) {
    if (e.target.name === 'room') {
      setGivenRoomCode(e.target.value);
    } else {
      setGivenPassword(e.target.value);
    }
  }

  function createAndJoinRoom (password) {
    if (givenRoomCode) {
      socket.emit('checkPassword', givenRoomCode, givenPassword);
    } else if (password) {
      setCreate(false);
      setRoomChoice(true);
      navigate(`/room/${roomCode1}`,{ state: { setPassword: givenPassword } });
    } else {
      setCreate(true);
    }
  }

  useEffect(() => {
    socket.on('passwordFail', () => {
      console.log('passwordFail');
      setIncorrect(true);
    })

    socket.on('passwordSucceed', (roomCode) => {
      setJoining(true);
      setGivenRoomCode(roomCode);
      setRoomChoice(true);
      navigate(`/room/${roomCode}`);
    });

    return () => {
      socket.off('passwordFail');
      socket.off('passwordSucceed');
    }
  }, [])

  return (
      <RoomChoiceContainer roomChoice={roomChoice} >
        {join ?
          <>
            <CodeInput>
              <label for="room">Enter Room Code:</label>
              <input name="room" onChange={(e) => handleChange(e)} ></input>
            </CodeInput>
            <PasswordInput>
              <label for="password">Enter Password:</label>
              <input name="password" onChange={(e) => handleChange(e)} ></input>
            </PasswordInput>
            {incorrect ? <PasswordMsg>Incorrect password</PasswordMsg> : null}
            <RoomButton row={4} onClick={() => (givenRoomCode && givenPassword) && createAndJoinRoom()}>Join</RoomButton>
          </>
          :
          create ?
          <>
            <PasswordInput>
                <label for="password">Create Password:</label>
                <input name="password" onChange={(e) => handleChange(e)} ></input>
            </PasswordInput>
            <RoomButton row={3} onClick={() => createAndJoinRoom(true)}>Set Password</RoomButton>
          </>
          :
          <>
            <RoomButton row={2} onClick={() => createAndJoinRoom()}>Create Room</RoomButton>
            <RoomButton row={3} onClick={() => setJoin(true)}>Join Room</RoomButton>
          </>
        }
      </RoomChoiceContainer>
    )
  }

  export default RoomComponent;