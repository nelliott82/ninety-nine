import React, { useState } from 'react';
import styled from 'styled-components';

const PlayerOneArea = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  grid-template-rows: 0.2fr 2fr;
  justify-items: center;
  align-items: center;
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
  grid-column: ${({index}) => index};
  grid-row: 2;
`
PlayerOneCards.defaultProps = {
  src: ''
}

var placeHolder = [2, 3, 4];

var PlayerOneComponent = ({ strikes, playerOneHand }) => {

return (
    <PlayerOneArea>
      <Name>PlayerOne:</Name>
      <Strikes>Strikes: {strikes[0]}</Strikes>
        {playerOneHand.length ? playerOneHand.map((card, i) => <Holder key={card[0] + 'p'} index={i + 2}>
                                                                <PlayerOneCards key={card[0] + 'p'}
                                                                                index={i + 2}
                                                                                src={`/assets/cards/${card[0]}.png`} />
                                                             </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} />)}
    </PlayerOneArea>
  )
}

export default PlayerOneComponent;