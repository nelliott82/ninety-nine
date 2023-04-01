import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { deleteCookie } from '../helperFiles/cookies.js';

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

const RoomComponent = ({ setJoining, setReady, setRoomCode1, roomCode1 }) => {
  const [join, setJoin] = useState(false);
  const [roomChoice, setRoomChoice] = useState(false);
  const [givenRoomCode, setGivenRoomCode] = useState('');
  //const createdRoomCode = generateCodes('');
  //let createdRoomCode = '';

  function handleChange (e) {
    setGivenRoomCode(e.target.value);
  }

  function createAndJoinRoom () {
    if (givenRoomCode) {
      setJoining(true);
      setGivenRoomCode(givenRoomCode);
    } else {
      //saveRoomCode(createdRoomCode);
      deleteCookie('username');
      deleteCookie('roomCode');
      deleteCookie('owner');
    }
    setReady(true);
    setRoomChoice(true);

  }
  console.log(roomCode1);
  return (
      <RoomChoiceContainer roomChoice={roomChoice} >
        {join ?
          <>
            <CodeInput>
              <label for="room">Enter Room Code:</label>
              <input name="room" onChange={(e) => handleChange(e)} ></input>
            </CodeInput>
            <Link to={`${givenRoomCode}`}>
              <RoomButton row={3} onClick={() => givenRoomCode && createAndJoinRoom()}>Join</RoomButton>
            </Link>
          </>
          :
          <>
            <Link to={`${roomCode1}`}>
              <RoomButton row={1} onClick={() => createAndJoinRoom()}>Create Room</RoomButton>
            </Link>
            <RoomButton row={3} onClick={() => setJoin(true)}>Join Room</RoomButton>
          </>
        }
      </RoomChoiceContainer>
    )
  }

  export default RoomComponent;