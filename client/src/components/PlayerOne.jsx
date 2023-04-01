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

var placeHolder = [2, 3, 4];

var PlayerOneComponent = ({ strikes, playerOneHand, turn, playCard, username }) => {
  let [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);
  }, []);

return (
    <PlayerOneArea turn={turn} animate={animate} >
      <Name>{username ? `Name: ${username}` : 'Player One'}</Name>
      <Strikes>Strikes: {Array.isArray(strikes) ? strikes[0] : strikes}</Strikes>
        {playerOneHand.length ? playerOneHand.map((card, i) => <Holder key={card[0] + 'p'} index={i + 2}>
                                                                <PlayerOneCards key={card[0] + 'p'}
                                                                                index={i + 2}
                                                                                onClick={() => {if (turn) { playCard(card, 0) }}}
                                                                                src={`/assets/cards/${card[0]}.png`} />
                                                               </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} />)}
    </PlayerOneArea>
  )
}

export default PlayerOneComponent;