import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const LandingMessage = styled.div`
  z-index: 100;
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%);
  color: black;
  font-size: 3em;
  text-align: center;
  width: 90vw;
  height: 100vh;
  @media (max-width: 1240px) {
    font-size: 1.5em;
    width: 90vw;
  }
`;

const scrollUpFunc = (scroll) => keyframes`
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-${scroll}px);
  }
`;

const scrollUp = keyframes`
  0% {
    transform: translateY(0vh);
  }
  100% {
    transform: translateY(-280vh);
  }
`;

const scrollUpMobile = keyframes`
  0% {
    transform: translateY(0vh);
  }
  100% {
    transform: translateY(-250vh);
  }
`;

const buttonScrollUp = keyframes`
  0% {
    transform: translateY(0vh);
  }
  100% {
    transform: translateY(-240vh);
  }
`;

const buttonScrollUpMobile = keyframes`
  0% {
    transform: translateY(0vh);
  }
  100% {
    transform: translateY(-240vh);
  }
`

const MessageScroll = styled.div`
  position: relative;
  display: inline-block;
  animation: ${({ scroll }) => scrollUpFunc(scroll)} 35s linear forwards;
`

const ButtonContainer = styled.div`
  height: 170vh;
  position: relative;
  animation: ${({ scroll }) => scrollUpFunc(scroll)} ${({ seconds }) => seconds}s linear forwards;
`

const BeginButton = styled.button`
  width: 16rem;
  height: 8rem;
  font-size: 3rem;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  &:hover {
    cursor: pointer;
  }
  @media (max-width: 1000px) {
    ${'' /* top: -50vh; */}
    width: 12rem;
    height: 7rem;
    font-size: 2rem;
  }
`

const LandingMessageComponent = () => {
  const navigate = useNavigate();
  const msgScrollElement = useRef(null);
  const [scroll, setScroll] = useState(0);
  const buttonContainerElement = useRef(null);
  const buttonElement = useRef(null);
  const [buttonScroll, setButtonScroll] = useState(0);

  // Get  the height of the text inside the div
  let textHeight = document.getElementById('test1');

  // Calculate the new distance based on the current scroll position and the height of the text
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let newDistance = (scrollTop + window.innerHeight) * (textHeight / window.innerHeight);


  function handleReadyClick () {
    navigate('/select');
  }

  function setScrolls () {
    setScroll(window.innerHeight + msgScrollElement.current.offsetHeight);
    setButtonScroll(msgScrollElement.current.offsetHeight + ((window.innerHeight + buttonElement.current.offsetHeight) / 2));
  }

  useEffect(() => {
    setScrolls();
    window.addEventListener('resize', setScrolls)

    return () => {
      window.removeEventListener('resize', setScrolls)
    }
  })

  return (
    <LandingMessage>
      <MessageScroll ref={msgScrollElement} scroll={scroll} >
        <p>
          Welcome to the game of 99! This is a simple but fun card game
          that is near and dear to my heart.
        </p>
        <p>
          I made this site so I could play against friends from a distance and
          also teach newcomers how to play. You can play against computers to practice
          and learn, or, if you're feeling brave, against humans (humans not included).
        </p>
        <p>
          The rules are fairly simple and are spelled out in more detail once
          you're in the playing area, but, basically, you take turns playing a card.
        </p>
        <p>
          Each card adds its own value to the round total. So, 3s add 3 points and 5s add
          5 points. And Special Cards (4s, 10s, 9s, and Kings) do something different and
          are crucial to avoiding losing. You can read more about the Special Cards in the
          playing area.
        </p>
        <p>
          The first player who can't keep the round total at, or, below 99 gets a strike
          and a new round starts. Three strikes and you're out. Last player standing wins.
        </p>
        <p>
          That's basically it! I hope you have fun!
          -Nikko
        </p>
      </MessageScroll>
      <ButtonContainer ref={buttonContainerElement} scroll={buttonScroll} seconds={(buttonScroll / scroll) * 35}>
        <BeginButton ref={buttonElement} onClick={handleReadyClick}>Click here to begin</BeginButton>
      </ButtonContainer>
    </LandingMessage>
    )
  }

  export default LandingMessageComponent;