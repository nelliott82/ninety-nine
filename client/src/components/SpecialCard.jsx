import React from 'react';
import styled from 'styled-components';

const SpecialCardDiv = styled.div`
  width: 10rem;
  height: 15rem;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.5r 1fr 0.5fr;
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

var SpecialCardComponent = () => {

return (
    <SpecialCardDiv>
      <CardName>King</CardName>
      <CardImage src='assets/cards/K♥.png' />
      <CardBehavior>Puts the total at 99, or, keeps it there</CardBehavior>
    </SpecialCardDiv>
  )
}

export default SpecialCardComponent;