import React, { useState } from 'react';
import styled from 'styled-components';

const PlayerOnerea = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  gap: 10px;
  grid-template-rows: 0.2fr 2fr 0.5fr;
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

var PlayerOneComponent = ({ strikes, computerHand, thinking, over }) => {

return (
    <ComputerArea>
      <Name>Computer:</Name>
      <Strikes>Strikes: {strikes[1]}</Strikes>
        {computerHand.length ? computerHand.map((card, i) => <Holder key={card[0] + 'c'} index={i + 2}>
                                                                <ComputerCards key={card[0] + 'c'}
                                                                               index={i + 2}
                                                                               src='/assets/cards/back.jpg' />
                                                             </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} />)}
        {thinking ? <Thinking>Thinking...</Thinking> : null}
        {over ? strikes[0] === 2 ?
              <FinalMsg>"Better luck next time!"</FinalMsg>
              :
              <FinalMsg>"Nooooooo!!"</FinalMsg>
        : null}
    </ComputerArea>
  )
}

export default PlayerOneComponent;