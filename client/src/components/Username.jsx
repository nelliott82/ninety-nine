import React, { useState } from 'react';
import styled from 'styled-components';

const UsernameContainer = styled.div`
  z-index: 101;
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const UsernameInput = styled.div`
  grid-row: 3;
  margin: 5% 17%;
  justify-items: center;
  align-items: center;
`;

const Message = styled.div`
  grid-row: 2;
  visibility: ${({ usernameMessage }) => usernameMessage ? 'visible' : 'hidden' };
  justify-items: center;
  align-items: center;
`;

const UsernameButton = styled.button`
  grid-row: 3;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

const UsernameComponent = ({ saveUsername, usernameMessage }) => {
  const [username, setUsername] = useState('');

  function handleChange (e) {
    setUsername(e.target.value);
  }

  return (
    <UsernameContainer>
      <Message usernameMessage={usernameMessage}>
       <p>Username already taken</p>
      </Message>
      <UsernameInput>
        <label for="username" >Enter Username:</label>
        <input name="username" onChange={(e) => handleChange(e)} ></input>
      </UsernameInput>
      <UsernameButton onClick={() => username && saveUsername(username) }>Set Username</UsernameButton>
    </UsernameContainer>
    )
  }

  export default UsernameComponent;