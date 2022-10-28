import React from 'react';
import styled from 'styled-components';

const ChooseContainer = styled.div`
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

const OpponentsDropDownLabel = styled.div`
  grid-row: 1;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
  text-align: center;
`;

const OpponentsDropDown = styled.select`
  grid-row: 2;
  width: 10rem;
  height: 2rem;
  font-size: 1.5em;
`;

const ChooseButton = styled.button`
  grid-row: 3;
  width: 10rem;
  height: 4rem;
  font-size: 1.5em;
`;

var ChooseOpponents = ({ selectOpponents, chooseOpponents }) => {

  return (
    <ChooseContainer>
      <OpponentsDropDownLabel>Choose Your Opponents:</OpponentsDropDownLabel>
      <OpponentsDropDown onChange={(e) => selectOpponents(e)}>
        <option value='' >-</option>
        <option value='computers' >Computers</option>
        <option value='humans' >Humans</option>
      </OpponentsDropDown>
      <ChooseButton onClick={() => chooseOpponents()}>Confirm Choice</ChooseButton>
    </ChooseContainer>
    )
  }

  export default ChooseOpponents;