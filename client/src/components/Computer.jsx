import React, { useState } from 'react';
import styled from 'styled-components';

const ComputerCards = styled.img`
  width: 10%;
  margin: 0 7px;
`
ComputerCards.defaultProps = {
  src: ''
}

var ComputerComponent = ({ strikes, computerHand, thinking, over }) => {

return (
    <div>
      <div>Computer:</div>
      <div>Strikes: {strikes[1]}</div>
        {computerHand.length ? computerHand.map(card => <ComputerCards key={card[0] + 'c'}
                                                                       src='/assets/cards/back.jpg' />)
                                                        : null}
        {thinking ? <div>Thinking...</div> : null}
        {over ? strikes[0] === 2 ?
              <div>"Better luck next time!"</div>
              :
              <div>"I'm not feeling well. That's the only reason you won."</div>
        : null}
    </div>
  )
}

export default ComputerComponent;