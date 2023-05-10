import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  grid-template-rows: 0.1fr 2fr 0.3fr;
  justify-items: center;
  align-items: center;
  box-sizing: border-box;
  @media (max-width: 1240px) {
    width: 95vw;
  }
`
const DeckName = styled.div`
  grid-column: 1;
  grid-row: 1;
`
const DiscardName = styled.div`
  grid-column: 3;
  grid-row: 1;
`

const DeckContainer = styled.div`
  grid-column: 1;
  grid-row: 2;
`

const PlayedContainer = styled.div`
  grid-column: 3;
  grid-row: 2;
`

const CardArea = styled.div`
  width: 130px;
  height: 200px;
  margin: 0px 15px;
  border: 2px solid black;
  @media (max-width: 1240px) {
    width: 70px;
    height: 108px;
    grid-row: 2;
  }
`

const CardStack = styled.img`
  width: 130px;
  height: 195px;
  margin-top: 3px;
  @media (max-width: 1240px) {
    margin-top: 2.25px;
    width: 70px;
    height: 105.5px;
  }
`

CardStack.defaultProps = {
  src: ''
}

const TimerContainer = styled.div`
  grid-column: 2;
  grid-row: 2;
  visibility: ${({ turn }) => turn ? 'visible' : 'hidden'};
  color: red;
  text-align: center;
  font-size: 3em;
`;

let syncCountdown = 15;
let playTimer;

var PlayingArea = ({ played, deck, turn, displayCountdown, gameStateTimer, playCard, hand, over }) => {
const [countdown, setCountdown] = useState(gameStateTimer);
let lastCard = played[played.length - 1];

function timer () {
  const endTime = new Date().getTime() + 1000 + (gameStateTimer * 1000);

  function showTime() {
    const currentTime = new Date().getTime();
    const remainingTime = endTime - currentTime;
    const seconds = Math.floor((remainingTime / 1000) % 60);

    syncCountdown = seconds;
    setCountdown(seconds);

    if (remainingTime >= 1000 && syncCountdown > 0) {
      requestAnimationFrame(showTime);
    } else if (syncCountdown === 0) {
      syncCountdown = 15;
    }
  }

  requestAnimationFrame(showTime);
}

useEffect(() => {
  clearTimeout(playTimer);
  setCountdown(countdown => gameStateTimer);
  if (displayCountdown && turn) {
    playTimer = setTimeout(() => {
      playCard(hand[0], 0);
    }, 16000);
    timer();
  }
  return () => {
    syncCountdown = 15;
    setCountdown(countdown => 15);
    clearTimeout(playTimer);
  }
}, [turn, displayCountdown, gameStateTimer]);

return (
    <Container>
          <DeckName>Deck</DeckName>
          <DeckContainer>
            <CardArea>
            {deck.length ?
              <CardStack
                  src='/assets/cards/back.jpg' />
            : null}
            </CardArea>
          </DeckContainer>
          <TimerContainer turn={turn && displayCountdown && !over} >
            {countdown.toString()}
          </TimerContainer>
          <DiscardName>Discard Pile</DiscardName>
          <PlayedContainer>
            <CardArea>
            {played.length ?
              <CardStack
                  src={`/assets/cards/${lastCard[0]}.png`}
                  alt={`This card is the ${lastCard[0].slice(0, lastCard[0].length - 1)} of ${lastCard[0].slice(lastCard[0].length - 1)}.`}
                  />
            : null}
            </CardArea>
          </PlayedContainer>
    </Container>
  )
}

export default PlayingArea;