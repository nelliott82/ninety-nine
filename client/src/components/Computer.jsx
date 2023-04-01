import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    border: 2px solid transparent;
    box-shadow: 0 0 10px transparent;
  }

  to {
    border: 2px solid blue;
    box-shadow: 0 0 10px blue;
  }
`;
const fadeOut = keyframes`
  from {
    border: 2px solid blue;
    box-shadow: 0 0 10px blue;
  }

  to {
    border: 2px solid transparent;
    box-shadow: 0 0 10px transparent;
  }
`;

const ComputerArea = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 5px;
  grid-template-rows: 0.1fr 2fr 0.3fr;
  justify-items: center;
  align-items: center;
  animation: ${({turn}) => turn ? fadeIn : fadeOut} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  border: ${({turn}) => turn ? '2px solid blue' : '2px solid transparent' };
  box-shadow: ${({turn}) => turn ? '0 0 10px blue' : '0 0 10px transparent' };
  transition: border 0.5s linear;
  @media (max-width: 1170px) {
    width: 90vw;
    height: ${({botsCount}) => {
      if (botsCount) {
        return '120px';
      } else {
        return '95%';
      }
    }};
    ${({botsCount}) => {
      if (botsCount) {
        return 'grid-template-columns: 1fr 1fr 1fr;';
      }
    }}
    grid-template-rows: ${({botsCount}) => {
      if (botsCount) {
        return '0.1fr 1fr 0.2fr';
      } else {
        return '0.1fr 2fr 0.3fr';
      }
    }};
  }
`

const Name = styled.div`
  grid-column: 2;
  grid-row: 1;
  @media (max-width: 1170px) {
    ${({botsCount}) => {
      if (botsCount) {
        return 'grid-column: 1;';
      }
    }}
  }
`
const Strikes = styled.div`
  grid-column: 4;
  grid-row: 1;
  @media (max-width: 1170px) {
    ${({botsCount}) => {
      if (botsCount) {
        return 'grid-column: 3;';
      }
    }}
  }
`

const Holder = styled.div`
  grid-column: ${({index}) => index};
  grid-row: 2;
  width: 130px;
  height: 200px;
  border: 2px solid black;
  @media (max-width: 1170px) {
    ${({botsCount, index}) => {
      if (botsCount) {
        return `grid-column: ${index - 1};`;
      }
    }}
    width: ${({botsCount}) => {
      if (botsCount) {
        return '40px';
      } else {
        return '90px';
      }
    }};
    height: ${({botsCount}) => {
      if (botsCount) {
        return '61.5px';
      } else {
        return '150px';
      }
    }};
    justify-self: ${({botsCount, index}) => {
      if (botsCount) {
        if (index === 2) {
          return 'right';
        } else if (index === 3) {
          return 'center';
        } else {
          return 'left';
        }
        return '52px';
      } else {
        return 'center';
      }
    }};
  }
`

const ComputerCards = styled.img`
  width: 130px;
  height: 195px;
  margin-top: 3px;
  grid-column: ${({index}) => index};
  grid-row: 2;
  @media (max-width: 1170px) {
    margin-top: 1px;
    ${({botsCount, index}) => {
      if (botsCount) {
        return `grid-column: ${index - 1};`;
      }
    }}
    width: ${({botsCount}) => {
      if (botsCount) {
        return '40px';
      } else {
        return '90px';
      }
    }};
    height: ${({botsCount}) => {
      if (botsCount) {
        return '60px';
      } else {
        return '146.5px';
      }
    }};
    justify-self: ${({botsCount, index}) => {
      if (botsCount) {
        if (index === 2) {
          return 'right';
        } else if (index === 3) {
          return 'center';
        } else {
          return 'left';
        }
        return '52px';
      } else {
        return 'center';
      }
    }};
  }
`
ComputerCards.defaultProps = {
  src: ''
}

const Thinking = styled.div`
  grid-column: 3;
  grid-row: 3;
  @media (max-width: 1170px) {
    ${({botsCount}) => {
      if (botsCount) {
        return 'grid-column: 2;';
      }
    }}
    font-size: 0.7em;
  }
`
const ThinkingNull = styled.div`
  grid-column: 3;
  grid-row: 3;
  height: 1rem;
`

const FinalMsg = styled.div`
  grid-column: 3;
  grid-row: 3;
`

let placeHolder = [2, 3, 4];

let ComputerComponent = ({ strikes, computerHand, thinking, over, turn, player, botsCount, username, countdown }) => {
  let [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);
  }, []);

  return (
    <ComputerArea turn={turn} animate={animate} strikes={strikes} botsCount={botsCount} >
      <Name botsCount={botsCount}>{username ? `Name: ${username}` : `Computer ${player}`}</Name>
      <Strikes botsCount={botsCount}>Strikes: {Array.isArray(strikes) ? strikes[player] : strikes}</Strikes>
        {computerHand.length ? computerHand.map((card, i) => <Holder key={card[0] + 'c'} index={i + 2} botsCount={botsCount}>
                                                                <ComputerCards key={card[0] + 'c'}
                                                                               index={i + 2}
                                                                               botsCount={botsCount}
                                                                               src='/assets/cards/back.jpg' />
                                                             </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} botsCount={botsCount}/>)}
        {turn ? <Thinking botsCount={botsCount}>{username ? /*'countdown.toString()'*/'' : 'Thinking...'}</Thinking> : <ThinkingNull/>}
        {/* {over ? strikes[player] < 3 ?
              <FinalMsg>"Better luck next time!"</FinalMsg>
              :
              <FinalMsg>"Nooooooo!!"</FinalMsg>
        : null}
        {!over === strikes[player] === 3 ?
              <FinalMsg>"Nooooooo!!"</FinalMsg>
        : null} */}
    </ComputerArea>
  )
}

export default ComputerComponent;