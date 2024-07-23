import React, { useState } from 'react';
import styled from 'styled-components';

const StartContainer = styled.div`
  z-index: 99;
  position: absolute;
  width: 15rem;
  height: 14rem;
  background-color: white;
  border-radius: 10px;
  display: ${({ display }) => display ? 'grid' : 'none'};
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 0.5fr 0.7fr;
  justify-items: center;
  align-items: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Customization = () => {

  return (
    <StartContainer display={display} >
      Hello world.
    </StartContainer>
    )
  }

  export default Customization;