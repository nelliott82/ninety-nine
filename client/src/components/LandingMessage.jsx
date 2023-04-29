import React from 'react';
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
    transform: translateY(-195vh);
  }
`

const MessageScroll = styled.div`
  height: 170vh;
  position: relative;
  animation: ${scrollUp} 40s linear forwards;
  @media (max-width: 1240px) {
    animation: ${scrollUpMobile} 40s linear forwards;
  }
`

const ButtonContainer = styled.div`
  height: 170vh;
  position: relative;
  animation: ${buttonScrollUp} 34.28s linear forwards;
  @media (max-width: 1000px) {
    animation: ${buttonScrollUpMobile} 31.2s linear forwards;
  }
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
    top: -50vh;
    width: 12rem;
    height: 7rem;
    font-size: 2rem;
  }
`

const LandingMessageComponent = () => {
  const navigate = useNavigate();

  function handleReadyClick () {
    navigate('/select');
  }

  return (
    <LandingMessage>
      <MessageScroll>
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
      <ButtonContainer>
        <BeginButton onClick={handleReadyClick}>Click here to begin</BeginButton>
      </ButtonContainer>
    </LandingMessage>
    )
  }

  export default LandingMessageComponent;