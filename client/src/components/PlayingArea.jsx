import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 2fr 1fr;
  gap: 10px;
`

const DeckContainer = styled.div`
  grid-column: 2;
  grid-row: 1;
`

const PlayedContainer = styled.div`
  grid-column: 4;
  grid-row: 1;
`

const CardArea = styled.div`
  width: 100%;
  border: 2px solid black;
`

const DeckStack = styled.img`
  width: 45%;
  object-fit: cover;
`

DeckStack.defaultProps = {
  src: ''
}


const PlayedStack = styled.img`
  width: 50%;
  object-fit: cover;
`

PlayedStack.defaultProps = {
  src: ''
}

var PlayingArea = ({ played, deck }) => {

return (
    <Container>
          <DeckContainer>
            <CardArea>
          {deck.length ?
            <DeckStack
                src='/assets/cards/back.jpg' />
          : null}
            </CardArea>
          </DeckContainer>
          <div>{deck.length}</div>
          &nbsp;
          &nbsp;
          <PlayedContainer>
            <CardArea>
          {played.length ?
            <PlayedStack
                src={`/assets/cards/${played[played.length - 1][0]}.png`} />
          : null}
            </CardArea>
          </PlayedContainer>
    </Container>
  )
}

export default PlayingArea;