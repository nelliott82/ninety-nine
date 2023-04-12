import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  grid-template-rows: 0.1fr 2fr 0.3fr;
  justify-items: center;
  align-items: center;
  box-sizing: border-box;
  @media (max-width: 1170px) {
    width: 95vw;
  }
`
const DeckName = styled.div`
  grid-column: 1;
  grid-row: 1;
`
const DiscardName = styled.div`
  grid-column: 2;
  grid-row: 1;
`

const DeckContainer = styled.div`
  grid-column: 1;
  grid-row: 2;
`

const PlayedContainer = styled.div`
  grid-column: 2;
  grid-row: 2;
`

const CardArea = styled.div`
  width: 130px;
  height: 200px;
  border: 2px solid black;
  @media (max-width: 1000px) {
    width: 90px;
    height: 150px;
    grid-row: 2;
  }
`

const CardStack = styled.img`
  width: 130px;
  height: 195px;
  margin-top: 3px;
  @media (max-width: 1000px) {
    margin-top: 2.25px;
    width: 90px;
    height: 146.5px;
  }
`

CardStack.defaultProps = {
  src: ''
}

var PlayingArea = ({ played, deck }) => {

return (
    <Container>
          <DeckName>Deck</DeckName>
          <DeckContainer>
            <CardArea>
            {deck.length ?
              <CardStack
                  src='/assets/cards/back.jpg' />
            : null}
            </CardArea>
          </DeckContainer>
          <DiscardName>Discard Pile</DiscardName>
          <PlayedContainer>
            <CardArea>
            {played.length ?
              <CardStack
                  src={`/assets/cards/${played[0][0]}.png`} />
            : null}
            </CardArea>
          </PlayedContainer>
    </Container>
  )
}

export default PlayingArea;