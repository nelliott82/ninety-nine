import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { makeCookieObject } from '../helperFiles/cookies.js';


const PasswordContainer = styled.div`
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

const PasswordInput = styled.div`
  grid-row: 1;
  margin: 5% 17%;
  justify-items: center;
  align-items: center;
`;

const Message = styled.div`
  grid-row: 2;
  visibility: ${({ message }) => message ? 'visible' : 'hidden' };
  justify-items: center;
  align-items: center;
`;

const PasswordButton = styled.button`
  grid-row: 3;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

const PasswordComponent = ({ roomCode, setUsernameChoice, setEnterPassword, socket, playerId }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(false);

  function handleChange (e) {
    setPassword(e.target.value);
  }

  function sendPassword (password) {
    socket.emit('password', roomCode, password)
  }

  useEffect(() => {
    let cookies = makeCookieObject();
    socket.on('passwordCheck', (valid) => {
      if (valid) {
        socket.emit('enter', roomCode, cookies.playerId);
        setEnterPassword(false);
        setUsernameChoice(true);
      } else {
        setMessage(true);
      }
    })

    return () => {
      socket.off('passwordCheck');
    }
  }, [])

  return (
    <PasswordContainer>
      <Message message={message}>
       <p>Incorrect Password</p>
      </Message>
      <PasswordInput>
        <label for="username" >Password:</label>
        <input name="username" onChange={(e) => handleChange(e)} ></input>
      </PasswordInput>
      <PasswordButton onClick={() => password && sendPassword(password) }>Enter</PasswordButton>
    </PasswordContainer>
    )
  }

  export default PasswordComponent;