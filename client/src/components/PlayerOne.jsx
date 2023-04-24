import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    border: 2px solid transparent;
    box-shadow: 0 0 10px transparent;
  }

  to {
    border: 2px solid blue;
    box-shadow: 0 0 10px blue;
  }
`;
const fadeOut = keyframes`
  from {
    border: 2px solid blue;
    box-shadow: 0 0 10px blue;
  }

  to {
    border: 2px solid transparent;
    box-shadow: 0 0 10px transparent;
  }
`;

const PlayerOneArea = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 5px;
  grid-template-rows: 0.1fr 2fr;
  justify-items: center;
  align-items: center;
  animation: ${({turn}) => turn ? fadeIn : fadeOut} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  border: ${({turn}) => turn ? '2px solid blue' : '2px solid transparent' };
  border-radius: 10px;
  box-shadow: ${({turn}) => turn ? '0 0 10px blue' : '0 0 10px transparent' };
  transition: border 0.5s linear;
  @media (max-width: 1000px) {
    width: 90vw;
  }
`

const Name = styled.div`
  grid-column: 2;
  grid-row: 1;
`
const Strikes = styled.div`
  grid-column: 4;
  grid-row: 1;
`

const Holder = styled.div`
  grid-column: ${({index}) => index};
  grid-row: 2;
  width: 130px;
  height: 200px;
  border: 2px solid black;
  @media (max-width: 1000px) {
    width: 90px;
    height: 150px;
    grid-row: 2;
  }
`

const PlayerOneCards = styled.img`
  width: 130px;
  height: 195px;
  margin-top: 3px;
  cursor: pointer;
  grid-column: ${({index}) => index};
  grid-row: 2;
  &:hover {
    border: 2px solid blue;
    box-shadow: 0 0 10px blue;
    border-radius: 5%;
    transform: scale(1.1);
  }
  @media (max-width: 1000px) {
    margin-top: 2.25px;
    width: 90px;
    height: 146.5px;
    grid-row: 2;
  }
`
PlayerOneCards.defaultProps = {
  src: ''
}

const TimerContainer = styled.div`
  visibility: ${({ turn }) => turn ? 'visible' : 'hidden'};
  color: red;
  position: absolute;
  text-align: center;
  font-size: 3em;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
`;

var placeHolder = [2, 3, 4];
let syncCountdown = 15;
let timerId;
let playTimer;
let blurred = false;

var PlayerOneComponent = ({ strikes, hand, turn, over, appCountdown, displayCountdown, gameStateTimer, playCard, username, human }) => {
  let [animate, setAnimate] = useState(false);
  const [countdown, setCountdown] = useState(gameStateTimer);

  function timer() {
    clearTimeout(timerId);
    console.log('timer in playerOne: ', syncCountdown);
    if (syncCountdown > 0) {
      timerId = setTimeout(() => {
        syncCountdown -= 1;
        setCountdown(countdown => countdown - 1);
        timer();
      }, 1000)
    } else {
      syncCountdown = 15;
    }
  }

  function blur() {
    blurred = true;
  }

  function focus() {
    blurred = false;
  }

  useEffect(() => {
    window.addEventListener("focus", focus);
    window.addEventListener("blur", blur);
    setTimeout(() => setAnimate(true), 500);
    setCountdown(countdown => gameStateTimer);
    if (displayCountdown && turn) {
      playTimer = setTimeout(() => {
        // if (!blurred) {
          console.log('playing card');
          playCard(hand[0], 0);
        // }
      }, 16000);
      timer();
    }
    return () => {
      syncCountdown = 15;
      setCountdown(countdown => 15);
      clearTimeout(timerId);
      window.removeEventListener("focus", focus);
      window.removeEventListener("blur", blur);
    }
  }, [turn, displayCountdown, gameStateTimer]);

return (
    <PlayerOneArea turn={turn} animate={animate} >
      <TimerContainer turn={turn && displayCountdown && !over} >
        <div>{countdown.toString()}</div>
      </TimerContainer>
      <Name>
        {human ? `Name: ${username !== 'Waiting...' ? username : ''}` : 'Player One'}
      </Name>
      <Strikes>{`Strikes: ${strikes}`}</Strikes>
        {hand.length ? hand.map((card, i) => <Holder key={i} index={i + 2}>
                                                                <PlayerOneCards key={i}
                                                                                index={i + 2}
                                                                                onClick={() => {
                                                                                  if (turn) {
                                                                                    clearTimeout(timerId);
                                                                                    clearTimeout(playTimer);
                                                                                    playCard(card, 0);
                                                                                  }
                                                                                }}
                                                                                src={`/assets/cards/${card[0]}.png`} />
                                                               </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} />)}
    </PlayerOneArea>
  )
}

export default PlayerOneComponent;