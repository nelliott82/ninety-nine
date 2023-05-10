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
  height: 14.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 5px;
  grid-template-rows: 0.1fr 2fr 0.3fr;
  justify-items: center;
  align-items: center;
  animation: ${({turn}) => turn ? fadeIn : fadeOut} ${({animate}) => animate ? '0.5s' : '0s' } linear;
  border: ${({turn}) => turn ? '2px solid blue' : '2px solid transparent' };
  border-radius: 10px;
  box-shadow: ${({turn}) => turn ? '0 0 10px blue' : '0 0 10px transparent' };
  background: ${({ active }) => active ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'};
  transition: border 0.5s linear;
  @media (max-width: 1240px) {
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
const InactiveContainer = styled.div`
  width: 100%;
  height: 50%;
  position: relative;
`

const Inactive = styled.p`
  visibility: ${({active}) => active ? 'visible' : 'hidden'};
  position: absolute;
  top: 240%;
  width: 35vw;
  text-align: center;
  z-index: 1;
  font-size: 3rem;
  color: red;
  @media (max-width: 1240px) {
    top: 50%;
    font-size: ${({botsCount}) => {
      if (botsCount) {
        return ' 1.5rem;';
      }
    }};
    width: ${({botsCount}) => {
      if (botsCount) {
        return '30vw';
      } else {
        return '90vw';
      }
    }};
  }
`

const Name = styled.div`
  grid-column: 2;
  grid-row: 1;
  @media (max-width: 1240px) {
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
  @media (max-width: 1240px) {
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
  position: relative;
  z-index: -1;
  width: 130px;
  height: 200px;
  border: 2px solid black;
  @media (max-width: 1240px) {
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
  @media (max-width: 1240px) {
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
  visibility: ${({ turn }) => turn ? 'visible' : 'hidden'};
  grid-column: 3;
  grid-row: 1;
  @media (max-width: 1240px) {
    ${({botsCount}) => {
      if (botsCount) {
        return 'grid-column: 2;';
      }
    }}
    ${'' /* font-size: 0.7em; */}
  }
`
const ThinkingNull = styled.div`
  grid-column: 3;
  grid-row: 1;
  height: 1rem;
`

const FinalMsg = styled.div`
  grid-column: 3;
  grid-row: 3;
`

const TimerContainer = styled.div`
  visibility: ${({ turn }) => turn ? 'visible' : 'hidden'};
  grid-column: 3;
  grid-row: 1;
  @media (max-width: 1240px) {
      ${({botsCount}) => {
        if (botsCount) {
          return 'grid-column: 2;';
        }
      }}
      ${'' /* font-size: 0.7em; */}
  }
`;

let placeHolder = [2, 3, 4];
let syncCountdown = 15;

let ComputerComponent = ({ strikes,
                           hand,
                           human,
                           computer,
                           over,
                           turn,
                           player,
                           botsCount,
                           username,
                           appCountdown,
                           displayCountdown,
                           gameStateTimer,
                           active,
                           newRoundDisplay,
                           on }) => {
  let [animate, setAnimate] = useState(false);
  const [countdown, setCountdown] = useState(gameStateTimer);

  function timer () {
    const endTime = new Date().getTime() + 1000 + (gameStateTimer * 1000);

    function showTime() {
      const currentTime = new Date().getTime();
      const remainingTime = endTime - currentTime;
      const seconds = Math.floor((remainingTime / 1000) % 60);

      syncCountdown = seconds;
      setCountdown(seconds);

      if (remainingTime >= 1000 && syncCountdown > 0) {
        requestAnimationFrame(showTime);
      } else if (syncCountdown === 0) {
        syncCountdown = 15;
      }
    }

    requestAnimationFrame(showTime);
  }

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);
    setCountdown(countdown => gameStateTimer);
    syncCountdown = gameStateTimer
    if (displayCountdown && turn) {
      timer();
    }
    return () => {
      syncCountdown = 15;
      setCountdown(countdown => 15);
    }
  }, [turn, displayCountdown, gameStateTimer, newRoundDisplay]);

  return (
    <ComputerArea turn={turn} active={!active && human && !on && !over} animate={animate} strikes={strikes} botsCount={botsCount} >
      <InactiveContainer>
        <Inactive botsCount={botsCount} active={!active && human && !on} >Player not in room</Inactive>
      </InactiveContainer>
      <Name botsCount={botsCount}>{human ?
                                    `Name: ${(username === 'Waiting...') && !active ? '' : username}`
                                    :
                                    `Computer ${player}`}</Name>
      <Strikes botsCount={botsCount}>{`Strikes: ${strikes}`}</Strikes>
        {hand.length ? hand.map((card, i) => <Holder key={i} index={i + 2} botsCount={botsCount}>
                                                                <ComputerCards key={i}
                                                                               index={i + 2}
                                                                               botsCount={botsCount}
                                                                               src={newRoundDisplay ? `/assets/cards/${card[0]}.png` : '/assets/cards/back.jpg'}
                                                                               alt={`The ${card[0]?.slice(0, card[0].length - 1)} of ${card[0]?.slice(card[0].length - 1)}.`}
                                                                               title={`The ${card[0]?.slice(0, card[0].length - 1)} of ${card[0]?.slice(card[0].length - 1)}.`}
                                                                               />
                                                            </Holder>)
                             : placeHolder.map(holder => <Holder key={holder} index={holder} botsCount={botsCount}/>)}
        {human ?
          <TimerContainer turn={turn && displayCountdown && !over} botsCount={botsCount} >
            <div>{countdown.toString()}</div>
          </TimerContainer>
          :
          <Thinking botsCount={botsCount} turn={turn} >Thinking...</Thinking>}
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