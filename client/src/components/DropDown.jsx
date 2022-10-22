import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import RulesComponent from './Rules.jsx';

const MoveUp = (from, to) => keyframes`
  from {
    top: ${from};
  }

  to {
    top: ${to};
  }
`;

const MoveDown = (from, to) => keyframes`
  from {
    top: ${from};
  }

  to {
    top: ${to};
  }
`;

const TopDropDown = styled.div`
  z-index: 101;
  width: 100%;
  height: 20rem;
  background-color: rgb(245,245,245);
  top: ${({showMenu}) => showMenu ? `0` : `-19.5rem`};
  animation: ${({showMenu}) => showMenu ? MoveUp('-19.5rem', '0rem') : MoveDown('0rem', '-19.5rem')} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  left: 0;
  position: fixed;
  :hover {
    cursor: pointer;
  }
  @media (max-width: 1220px) {
    height: 50rem;
    top: ${({showMenu}) => showMenu ? `0` : `-49.5rem`};
    animation: ${({showMenu}) => showMenu ? MoveUp('-49.5rem', '0rem') : MoveDown('0rem', '-49.5rem')} ${({animate}) => animate ? '0.5s' : '0s' } linear;

  }
`
const MoveUpTab = (from, to) => keyframes`
  from {
    top: ${from};
  }

  to {
    top: ${to};
  }
`;

const MoveDownTab = (from, to) => keyframes`
  from {
    top: ${from};
  }

  to {
    top: ${to};
  }
`;

const RulesTab = styled.div`
  z-index: 101;
  width: 5rem;
  height: 1.5rem;
  text-align: center;
  background-color: rgb(245,245,245);
  top: ${({showMenu}) => showMenu ? `20rem` : `0.5rem`};
  animation: ${({showMenu}) => showMenu ? MoveUpTab('0.5rem', '20rem') : MoveDownTab('20rem', '0.5rem')} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  left: 3rem;
  position: fixed;
  border-radius: 0 0 40% 40%;
  :hover {
    cursor: pointer;
  }
  @media (max-width: 1220px) {
    top: ${({showMenu}) => showMenu ? `50rem` : `0.5rem`};
    animation: ${({showMenu}) => showMenu ? MoveUpTab('0.5rem', '50rem') : MoveDownTab('50rem', '0.5rem')} ${({animate}) => animate ? '0.5s' : '0s' } linear;
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