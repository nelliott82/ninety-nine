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
  justify-self: center;
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
  grid-template-rows: 2rem 1fr;
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

const specialCards = [{ name: 'King' , card: 'K♥', behavior: 'Puts the total at 99, or, holds it there.' },
                      { name: 'Four' , card: '4♠', behavior: 'Reverses the order of play.' },
                      { name: 'Nine' , card: '9♦', behavior: 'Holds the total wherever it\'s at. Think of it as 0.' },
                      { name: 'Ten' , card: '10♣', behavior: 'Negative 10. Subtracts 10 from the total.' }]

const rules = ['Take turns playing a card. Player One (you) always starts.',
               'All cards are face value, except specialty cards, and add to the total.',
               'Aces are worth 1, and Queens and Jacks are worth 10.',
               'The object of the game is to keep the total at, or, below 99.',
               'First player unable to keep the total at, or, below 99 gets a strike.',
               'Strikes one and two start a new round.',
               'Three strikes and that player is out. Game ends if you lose.']

var RulesComponent = () => {

return (
    <RulesDropDown>
      <Title>99</Title>
      <Rules>
        <h3>How to Play:</h3>
        {rules.map(rule => <p>{rule}</p>)}
      </Rules>
      <SpecialsContainer>
        <Specials>
          <SpecialsHeader>Specialty Cards:</SpecialsHeader>
          {specialCards.map((cardObject, i) => {

            var { name, card, behavior } = cardObject;

            return (
              <SpecialHolder column={i + 1} row={2}>
                <SpecialCardComponent name={name}
                                      card={card}
                                      behavior={behavior} />
              </SpecialHolder>
              )
          })}
        </Specials>
      </SpecialsContainer>
    </RulesDropDown>
  )
}

export default RulesComponent;