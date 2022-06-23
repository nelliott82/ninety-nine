import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
  grid-template-rows: 0.1fr;
  justify-items: center;
  align-items: center;
`
const Total = styled.div`
  grid-column: 1;
  grid-row: 1;
  font-size: 1.5em;
`

var TotalComponent = ({ total }) => {

return (
    <Container>
        <Total>
          <span>Round Total: {total}</span>
        </Total>
    </Container>
  )
}

export default TotalComponent;