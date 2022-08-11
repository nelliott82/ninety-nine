import React, { useState } from 'react';
import styled from 'styled-components';

const RulesDropDown = styled.div`
  width: 100%;
  height: 20rem;
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr;
  grid-template-rows: 1fr;
  justify-items: left;
  align-items: center;
`
const Title = styled.h1`
  grid-column: 1;
  grid-row: 1;
`
const Rules = styled.div`
  grid-column: 2;
  grid-row: 1;
`
const Specials = styled.div`
  grid-column: 3;
  grid-row: 1;
`

var RulesComponent = () => {

return (
    <RulesDropDown>
      <Title>99</Title>
      <Rules>
        <h3>How to Play:</h3>
        <p>Take turns playing a card. Player One always starts.</p>
        <p>All cards are face value, except specialty cards, and add to the total.</p>
        <p>Aces are worth 1, and Queens and Jacks are worth 10.</p>
        <p>The object of the game is to keep the total at, or, below 99.</p>
        <p>First player unable to keep the total at, or, below 99 gets a strike.</p>
        <p>Strikes one and two start a new round.</p>
        <p>Three strikes and you're out. Game is over.</p>
      </Rules>
      <Specials>
        <h3>Specialty Cards:</h3>
        <p>King: Puts the total at 99, or, holds it there.</p>
        <p>10: Negative 10. Subtracts 10 from the total.</p>
        <p>9: Holds the total wherever it's at. Think of it as 0.</p>
        <p>4: Reverse order of play. With two players, this amounts to a hold.</p>
      </Specials>
    </RulesDropDown>
  )
}

export default RulesComponent;