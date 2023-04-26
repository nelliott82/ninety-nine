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
  border-radius: 10px;
  box-shadow: ${({turn}) => turn ? '0 0 10px blue' : '0 0 10px transparent' };
  background: ${({ active }) => active ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'};
  transition: border 0.5s linear;
  @media (max-width: 1240px) {
    width: 90vw;
    height: ${({botsCount}) => {
      if (botsCount) {
        return '95px';
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
    top: -90px;
    left: 150%;
    transform: translate(-50%);
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
  grid-row: 3;
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
let timerId;

let ComputerComponentMap = ({ strikes,
                              hand,
                              human,
                              computer,
                              over,
                              turn,
                              player,
                              botsCount,
                              username,
                              displayCountdown,
                              gameStateTimer,
                              active,
                              on }) => {
  let [animate, setAnimate] = useState(false);
  const [countdown, setCountdown] = useState(gameStateTimer);

  function timer() {
    clearTimeout(timerId);
    if (syncCountdown > 0) {
      timerId = setTimeout(() => {
        syncCountdown -= 1;
        setCountdown(countdown => countdown - 1);
        timer();
      }, 1000)
    } else {
      syncCountdown = 15;
    }
  }

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);
    setCountdown(countdown => gameStateTimer);
    if (displayCountdown && turn) {
      timer();
    }
    return () => {
      syncCountdown = 15;
      setCountdown(countdown => 15);
      clearTimeout(timerId);
    }
  }, [turn, displayCountdown, gameStateTimer]);

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
        {hand.length && strikes < 3 ? hand.map((card, i) => <Holder key={i} index={i + 2} botsCount={botsCount}>
                                                                <ComputerCards key={i}
                                                                               index={i + 2}
                                                                               botsCount={botsCount}
                                                                               src='/assets/cards/back.jpg' />
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

export default ComputerComponentMap;


          /* <>
          {player === 1 ? <Timer1Component turn={turn}
                                           over={over}
                                           displayCountdown={displayCountdown}
                                           botsCount={botsCount} /> : null}
          {player === 2 ? <Timer2Component turn={turn}
                                           over={over}
                                           displayCountdown={displayCountdown}
                                           botsCount={botsCount} /> : null}
          {player === 3 ? <Timer3Component turn={turn}
                                           over={over}
                                           displayCountdown={displayCountdown}
                                           botsCount={botsCount} /> : null}
          </> */