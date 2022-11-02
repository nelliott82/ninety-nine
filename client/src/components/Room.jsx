import React, { useState } from 'react';
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

var RoomComponent = ({ setJoining, setReady }) => {
  const [join, setJoin] = useState(false);
  const [roomChoice, setRoomChoice] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  function handleChange (e) {
    setRoomCode(e.target.value);
  }

  function createAndJoinRoom () {
    if (roomCode) {
      setJoining(true);
    } else {
      setRoomCode('placeHolder');
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
            <RoomButton row={3} onClick={() => roomCode && createAndJoinRoom(roomCode)}>Join</RoomButton>
          </>
          :
          <>
            <RoomButton row={1} onClick={() => createAndJoinRoom()}>Create Room</RoomButton>
            <RoomButton row={3} onClick={() => setJoin(true)}>Join Room</RoomButton>
          </>
        }
      </RoomChoiceContainer>
    )
  }

  export default RoomComponent;