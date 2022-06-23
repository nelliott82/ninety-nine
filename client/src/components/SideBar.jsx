import React, { useState } from 'react';
import styled from 'styled-components';

const SideBar = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.3fr 3fr 0.5fr;
  justify-items: center;
  align-items: center;
`

const Title = styled.h1`
  grid-column: 1;
  grid-row: 1;
`
const Rules = styled.div`
  grid-column: 1;
  grid-row: 2;
`

var SideBarComponent = () => {

return (
    <SideBar>
      <Title>99</Title>
      <Rules>
        <h3>How to Play:</h3>
        <ul>
          <li>Take turns playing a card. Player One always starts.</li>
          <li>All cards are face value, except specialty cards, and add to the total.</li>
          <li>Aces are worth 1, and Queens and Jacks are worth 10.</li>
          <li>The object of the game is to keep the total at, or, below 99.</li>
          <li>First player unable to keep the total at, or, below 99 gets a strike.</li>
          <li>Strikes one and two start a new round.</li>
          <li>Three strikes and you're out. Game is over.</li>
        </ul>
        <h3>Specialty Cards:</h3>
        <ul>
          <li>King: Puts the total at 99, or, holds it there.</li>
          <li>10: Negative 10. Subtracts 10 from the total.</li>
          <li>9: Holds the total wherever it's at. Think of it as 0.</li>
          <li>4: Reverse order of play. With two players, this amounts to a hold.</li>
        </ul>
      </Rules>
    </SideBar>
  )
}

export default SideBarComponent;