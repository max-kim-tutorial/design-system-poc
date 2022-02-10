import React, {useState} from 'react';
import styled from 'styled-components';

function StyledComp() {
  const [isBlue, setIsBlue] = useState(false);
  const [isBold, setIsBold] = useState(false);


  return (
      <div>
        <StyledText>나는 StyledComponent로 스타일링했다네</StyledText>
        <StyledDynamicText isBlue={isBlue} isBold={isBold} >나는 StyledComponent로 동적 스타일링했다네</StyledDynamicText>
        <button onClick={() => {setIsBold((s) => !s)}}>두껍게/얇게</button>
        <button onClick={() => {setIsBlue((s) => !s)}} >빨강/파랑</button>
      </div>
  )
}

const StyledText = styled.div`
  color: green;
`

type StyledDynamicTextProps = {
  isBlue:boolean;
  isBold:boolean;
}

const StyledDynamicText = styled.div<StyledDynamicTextProps>`
  color: ${({ isBlue }) => isBlue ? 'blue' : 'red'};
  font-weight: ${({ isBold }) => isBold ? 'bold' : 'normal'};
`

export default StyledComp;