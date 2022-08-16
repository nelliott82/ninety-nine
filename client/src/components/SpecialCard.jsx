import React from 'react';
import styled from 'styled-components';

const SpecialCardDiv = styled.div`
  width: 10rem;
  height: 15rem;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.9r 1fr 0.5fr;
  justify-items: center;
  align-items: center;
`
const CardName = styled.h3`
  grid-column: 1;
  grid-row: 1;
`
const CardImage = styled.img`
  width: 4.5rem;
  height: 7rem;
  grid-column: 1;
  grid-row: 2;
`

CardImage.defaultProps = {
  src: ''
}

const CardBehavior = styled.div`
  grid-column: 1;
  grid-row: 3;
  text-align: center;
`

var SpecialCardComponent = ({ name, card, behavior}) => {

return (
    <SpecialCardDiv>
      <CardName>{name}</CardName>
      <CardImage src={`assets/cards/${card}.png`} />
      <CardBehavior>{behavior}</CardBehavior>
    </SpecialCardDiv>
  )
}

export default SpecialCardComponent;