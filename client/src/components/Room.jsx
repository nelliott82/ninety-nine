import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import styled from 'styled-components';
import { setCookies, deleteCookies, makeCookieObject } from '../helperFiles/cookies.js';
import socket from '../helperFiles/socket.js';

let cookies = makeCookieObject();

const RoomChoiceContainer = styled.div`
  position: absolute;
  width: 15rem;
  height: 16rem;
  background-color: white;
  border-radius: 10px;
  display: ${({ roomChoice }) => roomChoice ? 'none' : 'grid'};
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1.5fr 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CodeInput = styled.div`
  grid-row: 1;
  margin: 5% 17%;
  justify-items: center;
  align-items: center;
`;

const PasswordInput = styled.div`
  grid-row: 3;
  margin: 5% 17%;
  justify-items: center;
  align-items: center;
`;

const ErrorMsg = styled.p`
  grid-row: ${({ row }) => row};
  visibile: ${({ display }) => display ? 'visible' : 'hidden'};
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
  const [givenRoomCode, setGivenRoomCode] = useState('');
  const [givenPassword, setGivenPassword] = useState('');
  const [create, setCreate] = useState(false);
  const [enterPassword, setEnterPassword] = useState(false);
  const [display, setDisplay] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  let [setStarted, started, setChose, joining, setJoining, setReady, setRoomCode1, roomCode1] = useOutletContext();

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
      console.log(givenRoomCode);
      socket.emit('roomCheck', givenRoomCode, givenPassword);
    } else if (givenPassword) {
      setCreate(false);
      setRoomChoice(true);
      setCookies([{ name: 'roomCode', value: roomCode1 },
                  { name: 'password', value: givenPassword }]);
      navigate(`/room/${roomCode1}`,{ state: { setPassword: givenPassword } });
    } else {
      setCreate(true);
    }
  }

  useEffect(() => {
    if (state) {
      setJoin(true);
      setDisplay(true);
      if (state.enterPassword) {
        setMessage('')
        setRoomCode1(state.roomCode);
        setGivenRoomCode(state.roomCode);
        setEnterPassword(true);
      } else {
        setMessage(state.message)
      }
    }

    socket.on('roomResult', (passwordResult, room, roomCode) => {
      setJoin(true);

      if (!room) {
        setDisplay(true);
        setMessage('That room does not exist.');
      } else if (passwordResult) {
        setJoining(true);
        setGivenRoomCode(roomCode);
        setRoomChoice(true);
        setCookies([{ name: 'password', value: syncPassword },
                    { name: 'roomCode', value: roomCode }]);
        navigate(`/room/${roomCode}`,{ state: { setPassword: syncPassword } });
      } else {
        console.log('passwordFail');
        setDisplay(true);
        setMessage('Incorrect password');
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
            <ErrorMsg display={display} row={2} >{ message }</ErrorMsg>
            <PasswordInput>
              <label for="password">Enter Password:</label>
              <input name="password" onChange={(e) => handleChange(e)} ></input>
            </PasswordInput>
            <RoomButton row={4} onClick={() => (givenRoomCode && givenPassword) && createAndJoinRoom()}>Join</RoomButton>
          </>
          :
          create ?
          <>
            <PasswordInput>
                <label for="password">Create Password:</label>
                <input name="password" onChange={(e) => handleChange(e)} ></input>
            </PasswordInput>
            <RoomButton row={4} onClick={() => createAndJoinRoom(true)}>Set Password</RoomButton>
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