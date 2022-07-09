import React from 'react';
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
  animation: ${({turn}) => turn ? fadeIn : fadeOut} 0.5s linear;
  border: ${({turn}) => turn ? '2px solid blue' : '2px solid transparent' };
  box-shadow: ${({turn}) => turn ? '0 0 10px blue' : '0 0 10px transparent' };
  border-radius: ${({turn}) => turn ? '25%/50%' : '25%/50%' };
  transition: border 0.5s linear;
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
`

const PlayerOneCards = styled.img`
  width: 130px;
  height: 195px;
  margin-top: 3px;
  cursor: pointer;
  &:hover {
    border: 2px solid blue;
    box-shadow: 0 0 10px blue;
    border-radius: 5%;
    transform: scale(1.1);
  }
  grid-column: ${({index}) => index};
  grid-row: 2;
`
PlayerOneCards.defaultProps = {
  src: ''
}
const ForfeitButton = styled.button`
  width: 5rem;
  height: 2rem;
  font-size: 1em;
  grid-column: 5;
  grid-row: 2;
`

var placeHolder = [2, 3, 4];

var PlayerOneComponent = ({ strikes, playerOneHand, turn, playCard, gameOver }) => {

return (
    <PlayerOneArea turn={turn} >
      <Name>PlayerOne:</Name>
      <Strikes>Strikes: {strikes[0]}</Strikes>
        {playerOneHand.length ? playerOneHand.map((card, i) => <Holder key={card[0] + 'p'} index={i + 2}>
                                                                <PlayerOneCards key={card[0] + 'p'}
                                                                                index={i + 2}
                                                                                onClick={() => {if (turn) { playCard(card, true) }}}
                                                                                src={`/assets/cards/${card[0]}.png`} />
                                                               </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} />)}
      <ForfeitButton onClick={() => {if (turn) { gameOver(true) }}} >Forfeit</ForfeitButton>
    </PlayerOneArea>
  )
}

export default PlayerOneComponent;