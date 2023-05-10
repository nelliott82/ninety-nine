import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const LandingMessage = styled.div`
  z-index: 99;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  color: black;
  font-size: ${({ fontSize }) => fontSize}vh;
  text-align: center;
  width: 90vw;
  height: 100vh;
`;

const scrollUpFunc = (scroll) => keyframes`
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(${scroll}px);
  }
`;

const MessageScroll = styled.div`
  position: relative;
  display: inline-block;
  top: ${({ top }) => top}px;
  animation: ${({ scroll }) => scrollUpFunc(scroll)} ${({ seconds }) => seconds}s linear forwards;
`

const ButtonContainer = styled.div`
  position: absolute;
  width: 90vw;
  top: ${({ top }) => top}px;
  animation: ${({ scroll }) => scrollUpFunc(scroll)} ${({ seconds }) => seconds}s linear forwards;
`

const BeginButton = styled.button`
  border-radius: 10px;
  display: inline-block;
  font-size: 5vh;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  &:hover {
    cursor: pointer;
  }
`

const SkipButton = styled.button`
  z-index: 100;
  border-radius: 10px;
  display: inline-block;
  font-size: 3vh;
  position: fixed;
  top: 90%;
  left: 95%;
  transform: translate(-90%);
  &:hover {
    cursor: pointer;
  }
`

let maxSeconds = 40;

const LandingMessageComponent = () => {
  const navigate = useNavigate();
  const startTime = useRef(new Date().getTime());
  const msgScrollElement = useRef(null);
  const [start, setStart] = useState(window.innerHeight / 2);
  const [scroll, setScroll] = useState(0);
  const buttonContainerElement = useRef(null);
  const buttonElement = useRef(null);
  const [buttonStart, setButtonStart] = useState(100);
  const [buttonScroll, setButtonScroll] = useState(0);
  const [seconds, setSeconds] = useState(maxSeconds);
  const [buttonSeconds, setButtonSeconds] = useState(maxSeconds);
  const [top, setTop] = useState(0);
  const [buttonTop, setButtonTop] = useState(0);
  const [fontSize, setFontSize] = useState(6);

  function handleReadyClick () {
    navigate('/select');
  }

  function setScrolls () {
    if (window.innerHeight > window.innerWidth) {
      setFontSize(4);
      maxSeconds = 50;
    } else {
      setFontSize(6);
      maxSeconds = 40;
    }
    let endTime = new Date().getTime();
    let secondsElapsed = (endTime - startTime.current) / 1000;
    let percentElapsed = Math.min(1, secondsElapsed / maxSeconds);
    let percentRemaining = 1 - percentElapsed;

    let newStart = window.innerHeight / 2;
    let startOffset = percentElapsed * ((window.innerHeight + msgScrollElement.current.offsetHeight) * 1.1);
    newStart = newStart - startOffset;

    let newScroll = Math.floor((window.innerHeight + msgScrollElement.current.offsetHeight) * 1.1);
    newScroll = (newScroll - startOffset) * -1;

    setTop(top => newStart);
    setScroll(scroll => newScroll);
    setSeconds(seconds => maxSeconds - secondsElapsed);

    let newButtonScroll = window.innerHeight / 2 + msgScrollElement.current.offsetHeight + buttonElement.current.offsetHeight / 2;
    newButtonScroll = (newButtonScroll - startOffset) * -1;

    let distance = Math.abs(newScroll * percentRemaining);
    let buttonDistance = Math.abs(newButtonScroll * percentRemaining);

    let originalDistance = Math.floor((window.innerHeight + msgScrollElement.current.offsetHeight) * 1.1);
    let originalButtonDistance = window.innerHeight / 2 + msgScrollElement.current.offsetHeight + buttonElement.current.offsetHeight / 2;

    let secondsThreshold = maxSeconds * (originalButtonDistance / originalDistance);

    if (secondsElapsed <= secondsThreshold) {
      setButtonSeconds(buttonSeconds => (maxSeconds - secondsElapsed) * (buttonDistance / distance));

      setButtonTop(buttonTop => Math.max(newStart + msgScrollElement.current.offsetHeight, Math.min(-buttonElement.current.offsetHeight / 2, newButtonScroll)));
      setButtonScroll(buttonScroll => Math.min(-buttonElement.current.offsetHeight / 2, newButtonScroll));

    } else {
      setButtonSeconds(buttonSeconds => 0);
      setButtonTop(buttonTop => -buttonElement.current.offsetHeight / 2);
      setButtonScroll(buttonScroll => 0);
    }
  }

  useEffect(() => {
    setScrolls();

    const elementToObserve = msgScrollElement.current;

    const resizeObserver = new ResizeObserver(entries => {
      setScrolls();
    });

    resizeObserver.observe(elementToObserve);

    return () => resizeObserver.unobserve(elementToObserve);
  }, [])

  return (
    <>
      <SkipButton onClick={handleReadyClick}>Skip</SkipButton>
      <LandingMessage fontSize={fontSize} >
        <MessageScroll ref={msgScrollElement}
                      scroll={scroll}
                      top={top}
                      seconds={seconds} >
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
        <ButtonContainer ref={buttonContainerElement}
                        scroll={buttonScroll}
                        top={buttonTop}
                        seconds={buttonSeconds}>
          <BeginButton ref={buttonElement} onClick={handleReadyClick}>Click here to begin</BeginButton>
        </ButtonContainer>
      </LandingMessage>
    </>
    )
  }

  export default LandingMessageComponent;