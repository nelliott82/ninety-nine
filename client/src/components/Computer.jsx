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

const ComputerArea = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 5px;
  grid-template-rows: 0.1fr 2fr 0.2fr;
  justify-items: center;
  align-items: center;
  animation: ${({turn}) => turn ? fadeOut : fadeIn} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  border: ${({turn}) => turn ? '2px solid transparent' : '2px solid blue' };
  box-shadow: ${({turn}) => turn ? '0 0 10px transparent' : '0 0 10px blue' };
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

const ComputerCards = styled.img`
  width: 130px;
  height: 195px;
  margin-top: 3px;
  grid-column: ${({index}) => index};
  grid-row: 2;
`
ComputerCards.defaultProps = {
  src: ''
}

const Thinking = styled.div`
  grid-column: 3;
  grid-row: 3;
`

const FinalMsg = styled.div`
  grid-column: 3;
  grid-row: 3;
`

var placeHolder = [2, 3, 4];

var ComputerComponent = ({ strikes, computerHand, thinking, over, turn }) => {
  var [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);
  }, []);

return (
    <ComputerArea turn={turn} animate={animate} >
      <Name>Computer:</Name>
      <Strikes>Strikes: {strikes[1]}</Strikes>
        {computerHand.length ? computerHand.map((card, i) => <Holder key={card[0] + 'c'} index={i + 2}>
                                                                <ComputerCards key={card[0] + 'c'}
                                                                               index={i + 2}
                                                                               src='/assets/cards/back.jpg' />
                                                             </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} />)}
        {thinking ? <Thinking>Thinking...</Thinking> : null}
        {over ? strikes[0] === 3 ?
              <FinalMsg>"Better luck next time!"</FinalMsg>
              :
              <FinalMsg>"Nooooooo!!"</FinalMsg>
        : null}
    </ComputerArea>
  )
}

export default ComputerComponent;