import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import styled from 'styled-components';
import { setCookies, deleteCookie } from '../helperFiles/cookies.js';
import socket from '../helperFiles/socket.js';

const RoomChoiceContainer = styled.div`
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  display: ${({ roomChoice }) => roomChoice ? 'none' : 'grid'};
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
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
  grid-row: 3;
  justify-items: center;
  align-items: center;
`;

const ErrorMsg = styled.p`
  grid-row: ${({ row }) => row};
`;

const RoomButton = styled.button`
  grid-row: ${({ row }) => row};
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

let syncRoomCode = '';
let syncPassword = '';

const RoomComponent = () => {
  let { state } = useLocation();
  const [join, setJoin] = useState(false);
  const [roomChoice, setRoomChoice] = useState(false);
  const [noRoom, setNoRoom] = useState(false);
  const [givenRoomCode, setGivenRoomCode] = useState('');
  const [givenPassword, setGivenPassword] = useState('');
  const [create, setCreate] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [enterPassword, setEnterPassword] = useState(false);
  const navigate = useNavigate();
  let [setStarted, setChose, joining, setJoining, setReady, setRoomCode1, roomCode1] = useOutletContext();

  function handleChange (e) {
    if (e.target.name === 'room') {
      syncRoomCode = e.target.value;
      setGivenRoomCode(e.target.value);
    } else {
      syncPassword = e.target.value;
      setGivenPassword(e.target.value);
    }
  }

  function createAndJoinRoom (owner) {
    if (owner) {
      setCookies([{ name: 'owner', value: true }]);
    }
    if (givenRoomCode) {
      socket.emit('roomCheck', givenRoomCode, givenPassword);
    } else if (givenPassword) {
      setCreate(false);
      setRoomChoice(true);
      setCookies([{ name: 'roomCode', value: roomCode1 }, { name: 'password', value: givenPassword }]);
      navigate(`/room/${roomCode1}`,{ state: { setPassword: givenPassword } });
    } else {
      setCreate(true);
    }
  }

  useEffect(() => {
    if (state) {
      if (state.enterPassword) {
        setRoomCode1(state.roomCode);
        setGivenRoomCode(state.roomCode);
        setEnterPassword(true);
        setJoin(true);
      } else if (state.message === 'Incorrect password') {
        setIncorrect(true);
      } else {
        setNoRoom(true);
      }
    } else {
      state = { message: 'That room does not exist.' };
    }

    socket.on('roomResult', (passwordResult, room, roomCode) => {
      setJoin(true);
      if (!room) {
        setNoRoom(true);
      }
      if (passwordResult) {
        setJoining(true);
        setGivenRoomCode(roomCode);
        setRoomChoice(true);
        setCookies([{ name: 'password', value: syncPassword }, { name: 'roomCode', value: roomCode }]);
        navigate(`/room/${roomCode}`,{ state: { setPassword: syncPassword } });
      } else {
        console.log('passwordFail');
        setIncorrect(true);
      }
    })

    return () => {
      socket.off('roomResult');
    }
  }, [])

  return (
      <RoomChoiceContainer roomChoice={roomChoice} >
        {join ?
          <>
            {enterPassword ? null :
            <CodeInput>
              <label for="room">Enter Room Code:</label>
              <input name="room" onChange={(e) => handleChange(e)} ></input>
            </CodeInput>
            }
            {noRoom ? <ErrorMsg row={2} >{ state.message }</ErrorMsg> : null}
            <PasswordInput>
              <label for="password">Enter Password:</label>
              <input name="password" onChange={(e) => handleChange(e)} ></input>
            </PasswordInput>
            {incorrect && !noRoom ? <ErrorMsg row={4} >Incorrect password.</ErrorMsg> : null}
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
            <RoomButton row={4} onClick={() => setJoin(true)}>Join Room</RoomButton>
          </>
        }
      </RoomChoiceContainer>
    )
  }

  export default RoomComponent;