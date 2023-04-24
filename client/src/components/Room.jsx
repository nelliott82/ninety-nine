import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import styled from 'styled-components';
import { setCookies, deleteCookies, makeCookieObject } from '../helperFiles/cookies.js';
import socket from '../helperFiles/socket.js';

let cookies = makeCookieObject();

const RoomChoiceContainer = styled.div`
  position: absolute;
  width: 15rem;
  height: ${({ join }) => join ? '16rem' : '14rem'};
  background-color: white;
  border-radius: 10px;
  display: grid;
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
  grid-row: ${({ row }) => row};
  margin: 5% 17%;
  justify-items: center;
  align-items: center;
`;

const ErrorMsg = styled.p`
  grid-row: ${({ row }) => row};
  visibile: 'visible';
  text-align: center;
  height: 0.5rem;
`;

const RoomButton = styled.button`
  grid-row: ${({ row }) => row};
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
  margin-bottom: ${({ margin }) => margin ? '5px' : '0' };
`;

let syncRoomCode = '';
let syncPassword = '';

const RoomComponent = ({ roomCodeApp, setChooseRoom, setReady }) => {
  const cookies = makeCookieObject();
  const [join, setJoin] = useState(false);
  const [roomChoice, setRoomChoice] = useState(false);
  const [changeRooms, setChangeRooms] = useState(false);
  const [givenRoomCode, setGivenRoomCode] = useState('');
  const [givenPassword, setGivenPassword] = useState('');
  const [create, setCreate] = useState(false);
  const [enterPassword, setEnterPassword] = useState(false);
  const [display, setDisplay] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
      setCookies([{ name: 'creator', value: true }]);
    }
    if (givenRoomCode) {
      socket.emit('roomCheck', givenRoomCode, givenPassword);
    } else if (givenPassword) {
      setCreate(false);
      setRoomChoice(true);
      setChooseRoom(false);
      setReady(true);
      navigate(`/room/${roomCodeApp}`,{ state: { setPassword: givenPassword } });
    } else {
      setCreate(true);
    }
  }

  useEffect(() => {

    socket.on('roomResult', (passwordResult, room, roomCode) => {
      setJoin(true);

      if (!room) {
        console.log('room check is not fine')

        setDisplay(true);
        setMessage('That room does not exist.');
      } else if (passwordResult) {
        console.log('room check is fine')
        setGivenRoomCode(roomCode);
        setRoomChoice(true);
        setChooseRoom(false);
        setReady(true);
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
      <RoomChoiceContainer join={join} >
        {join ?
          <>
            {enterPassword ? null :
            <CodeInput>
              <label for="room">Enter 4-character Room Code:</label>
              <input name="room" maxLength='4' onChange={(e) => handleChange(e)} ></input>
            </CodeInput>
            }
            <ErrorMsg row={2} >{ message }</ErrorMsg>
            <PasswordInput row={3}>
              <label for="password">Enter Password:</label>
              <input name="password" onChange={(e) => handleChange(e)} ></input>
            </PasswordInput>
            <RoomButton row={4} onClick={() => (givenRoomCode && givenPassword) && createAndJoinRoom()}>Join</RoomButton>
          </>
          :
          create ?
          <>
            <PasswordInput row={1}>
                <label for="password">Create Password:</label>
                <input name="password" maxLength='15' onChange={(e) => handleChange(e)} ></input>
            </PasswordInput>
            <RoomButton row={5} margin={true} onClick={() => createAndJoinRoom(true)}>Set Password</RoomButton>
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