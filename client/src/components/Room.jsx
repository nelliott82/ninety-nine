import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

const RoomChoiceContainer = styled.div`
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  display: ${({ roomChoice }) => roomChoice ? 'none' : 'grid'};
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.5fr 1fr;
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

const RoomButton = styled.button`
  grid-row: ${({ row }) => row};
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function generateCodes (str) {
  if (str.length === 4) {
    return str;
  }
  return generateCodes(str + allLetters[Math.floor(Math.random() * 26)]);
}

function get_cookie(name){
  return document.cookie.split(';').some(c => {
      return c.trim().startsWith(name + '=');
  });
}

function delete_cookie( name ) {
  if( get_cookie( name ) ) {
    document.cookie = name + "=" +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

const RoomComponent = ({ setJoining, setReady, saveRoomCode }) => {
  const [join, setJoin] = useState(false);
  const [roomChoice, setRoomChoice] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const createdRoomCode = generateCodes('');

  function handleChange (e) {
    setRoomCode(e.target.value);
  }

  function createAndJoinRoom () {
    if (roomCode) {
      setJoining(true);
      saveRoomCode(roomCode);
    } else {
      setRoomCode('1234');
      saveRoomCode(createdRoomCode);
      delete_cookie('username');
      delete_cookie('roomCode');
    }
    setReady(true);
    setRoomChoice(true);

  }

  return (
      <RoomChoiceContainer roomChoice={roomChoice} >
        {join ?
          <>
            <CodeInput>
              <label for="room">Enter Room Code:</label>
              <input name="room" onChange={(e) => handleChange(e)} ></input>
            </CodeInput>
            <Link to={`${roomCode}`}>
              <RoomButton row={3} onClick={() => roomCode && createAndJoinRoom(roomCode)}>Join</RoomButton>
            </Link>
          </>
          :
          <>
            <Link to={`${createdRoomCode}`}>
              <RoomButton row={1} onClick={() => createAndJoinRoom()}>Create Room</RoomButton>
            </Link>
            <RoomButton row={3} onClick={() => setJoin(true)}>Join Room</RoomButton>
          </>
        }
      </RoomChoiceContainer>
    )
  }

  export default RoomComponent;