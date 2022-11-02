import React, { useState } from 'react';
import styled from 'styled-components';

const StartContainer = styled.div`
  z-index: 101;
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.5fr 0.7fr;
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

const StartButton = styled.button`
  grid-row: 3;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

const UsernameComponent = ({ saveUsername }) => {
  const [username, setUsername] = useState('');

  function handleChange (e) {
    setUsername(e.target.value);
  }

  return (
    <StartContainer>
      <CodeInput>
        <label for="username" >Enter Username:</label>
        <input name="username" onChange={(e) => handleChange(e)} ></input>
      </CodeInput>
      <StartButton onClick={() => username && saveUsername(username) }>Set Username</StartButton>
    </StartContainer>
    )
  }

  export default UsernameComponent;