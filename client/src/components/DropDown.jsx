import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import RulesComponent from './Rules.jsx';

const MoveUp = keyframes`
  from {
    top: -19.5rem;
  }

  to {
    top: 0rem;
  }
`;

const MoveDown = keyframes`
  from {
    top: 0rem;
  }

  to {
    top: -19.5rem;
  }
`;

const TopDropDown = styled.div`
  z-index: 101;
  width: 100%;
  height: 20rem;
  background-color: rgb(245,245,245);
  top: ${({showMenu}) => showMenu ? `0` : `-19.5rem`};
  animation: ${({showMenu}) => showMenu ? MoveUp : MoveDown} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  left: 0;
  position: fixed;
  :hover {
    cursor: pointer;
  }
`
const MoveUpTab = keyframes`
  from {
    top: 0.5rem;
  }

  to {
    top: 20rem;
  }
`;

const MoveDownTab = keyframes`
  from {
    top: 20rem;
  }

  to {
    top: 0.5rem;
  }
`;

const RulesTab = styled.div`
  z-index: 101;
  width: 5rem;
  height: 1.5rem;
  text-align: center;
  background-color: rgb(245,245,245);
  top: ${({showMenu}) => showMenu ? `20rem` : `0.5rem`};
  animation: ${({showMenu}) => showMenu ? MoveUpTab : MoveDownTab} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  left: 3rem;
  position: fixed;
  border-radius: 0 0 40% 40%;
  :hover {
    cursor: pointer;
  }
`

var DropDownComponent = () => {
  var [showMenu, setShowMenu] = useState(false);
  var [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);
  }, []);

  function handleMenuClick() {
    setShowMenu(showMenu => !showMenu);
  }

  return (
    <>
      <TopDropDown showMenu={showMenu} animate={animate} onClick={handleMenuClick}>
        <RulesComponent/>
      </TopDropDown>
      <RulesTab showMenu={showMenu} animate={animate} onClick={handleMenuClick}>Da Rules</RulesTab>
    </>
    )
  }

  export default DropDownComponent;