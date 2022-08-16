import React from 'react';
import styled from 'styled-components';
import SpecialCardComponent from './SpecialCard.jsx';

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
const SpecialsContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
`
const Specials = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.2fr 1fr;
  gap: 5px;
  justify-items: center;
  align-items: center;
`

const SpecialsHeader = styled.h3`
  grid-column: 1;
  grid-row: 1;
`

const SpecialHolder = styled.span`
  grid-column: ${({ column }) => column };
  grid-row: ${({ row }) => row };
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
      <SpecialsContainer>
        <Specials>
          <SpecialsHeader>Specialty Cards:</SpecialsHeader>
          <SpecialHolder column={'1'} row={'2'}>
              <SpecialCardComponent name={'King'}
                                    card={'K♥'}
                                    behavior={'Puts the total at 99, or, holds it there.'} />
          </SpecialHolder>
          <SpecialHolder column={'2'} row={'2'} >
              <SpecialCardComponent name={'Four'}
                                    card={'4♠'}
                                    behavior={'Reverses the order of play.'} />
          </SpecialHolder>
          <SpecialHolder column={'3'} row={'2'} >
              <SpecialCardComponent name={'Nine'}
                                    card={'9♦'}
                                    behavior={'Holds the total wherever it\'s at. Think of it as 0.'} />
          </SpecialHolder>
          <SpecialHolder column={'4'} row={'2'} >
              <SpecialCardComponent name={'Ten'}
                                    card={'10♣'}
                                    behavior={'Negative 10. Subtracts 10 from the total.'} />
          </SpecialHolder>
        </Specials>
      </SpecialsContainer>
    </RulesDropDown>
  )
}

export default RulesComponent;