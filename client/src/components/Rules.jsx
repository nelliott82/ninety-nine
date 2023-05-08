import React from 'react';
import styled from 'styled-components';
import SpecialCardComponent from './SpecialCard.jsx';

const RulesDropDown = styled.div`
  z-index: 1001;
  margin-left: 0.5rem;
  width: 98vw;
  height: 310px;
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr;
  grid-template-rows: 1fr;
  justify-items: left;
  align-items: center;
  @media (max-width: 1220px) {
    height: 960px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    justify-items: left;
    align-items: center;
    overflow-y: auto;
  }
`
const Title = styled.h1`
  justify-self: center;
  grid-column: 1;
  grid-row: 1;
  @media (max-width: 1220px) {
    justify-self: left;
    grid-column: 1;
    grid-row: 1;
  }
`
const Rules = styled.div`
  grid-column: 2;
  grid-row: 1;
  @media (max-width: 1220px) {
    grid-column: 1;
    grid-row: 2;
  }
`
const SpecialsContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  @media (max-width: 1220px) {
    grid-column: 1;
    grid-row: 3;
  }
`
const Specials = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 2rem 1fr;
  gap: 5px;
  justify-items: center;
  align-items: center;
  @media (max-width: 1220px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 2rem 1fr 1fr;
  }
`

const SpecialsHeader = styled.h3`
  grid-column: 1;
  grid-row: 1;
`

const SpecialHolder = styled.span`
  grid-column: ${({ column }) => column };
  grid-row: 2;
  @media (max-width: 1220px) {
    grid-column: ${({ column }) => {
      if (column < 3) {
        return column;
      }
      return column - 2;
    }};
    grid-row: ${({ column }) => {
      if (column < 3) {
        return 2;
      }
      return 3;
    }};
  }
`

const specialCards = [{ name: 'King' , card: 'K♥', behavior: 'Puts the total at 99, or, holds it there.' },
                      { name: 'Four' , card: '4♠', behavior: 'Reverses the order of play.' },
                      { name: 'Nine' , card: '9♦', behavior: 'Holds the total wherever it\'s at. Think of it as 0.' },
                      { name: 'Ten' , card: '10♣', behavior: 'Negative 10. Subtracts 10 from the total.' }]

const botRules = ['Take turns playing a card. Player One (you) always starts.',
                  'All cards are face value, except specialty cards, and add to the total.',
                  'Aces are worth 1, and Queens and Jacks are worth 10.',
                  'The object of the game is to keep the total at, or, below 99.',
                  'First player unable to keep the total at, or, below 99 gets a strike.',
                  'Strikes one and two start a new round.',
                  'All players\' hands are shown at end of round/game during a brief pause.',
                  'Three strikes and that player is out. Game ends if you lose.']

const humanRules = ['The object is to keep the round total at, or, below 99.',
                    'All cards are face value, except specialty cards, and add to the total.',
                    'Aces are worth 1, and Queens and Jacks are worth 10.',
                    'Take turns playing a card.',
                    'You have 15 seconds to play a card.',
                    'If a card is not played after 15 seconds, left most card is automatically played.',
                    'If a player leaves the room, their left most card is automatically played after 3 seconds.',
                    'First player unable to keep the total at, or, below 99 gets a strike.',
                    'Strikes one and two for any player start a new round.',
                    'Three strikes and that player is out.',
                    'Game ends when only one player is still in.',
                    'All players\' hands are shown at end of round/game during a brief pause.',
                    'If all players leave the room, the room is automatically closed.',
                    'The creator of the room has the choice to restart the game, or, end it at conclusion.']

var RulesComponent = ({ opponents }) => {

return (
    <RulesDropDown>
      <Title>99</Title>
      <Rules>
        <h3>How to Play:</h3>
        {opponents === 'computers' ? botRules.map(rule => <p>{rule}</p>) : null}
        {opponents === 'humans' ? humanRules.map(rule => <p>{rule}</p>) : null}
      </Rules>
      <SpecialsContainer>
        <Specials>
          <SpecialsHeader>Specialty Cards:</SpecialsHeader>
          {specialCards.map((cardObject, i) => {

            var { name, card, behavior } = cardObject;

            return (
              <SpecialHolder column={i + 1} >
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