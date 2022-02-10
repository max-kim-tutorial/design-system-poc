import React, {useState} from 'react';
import { css } from '@emotion/react'
import styled from '@emotion/styled'

function EmotionComp() {
  const [isBlue, setIsBlue] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isBlue2, setIsBlue2] = useState(false);
  const [isBold2, setIsBold2] = useState(false);

  return (
      <div>
        <div css={{color:'red'}}>나는 css props로 스타일링한 글자라네</div>
        <div css={textStyle(isBold2, isBlue2)}>나는 css props로 동적 스타일링한 글자라네</div>
        <button onClick={() => {setIsBold2((s) => !s)}}>두껍게/얇게</button>
        <button onClick={() => {setIsBlue2((s) => !s)}} >빨강/파랑</button>
        <StyledDynamicStyle isBlue={isBlue} isBold={isBold}>나는 emotion styled로 스타일링한 글자라네</StyledDynamicStyle>
        <button onClick={() => {setIsBold((s) => !s)}}>두껍게/얇게</button>
        <button onClick={() => {setIsBlue((s) => !s)}} >빨강/파랑</button>
      </div>
  )
}

const textStyle = (isBold:boolean, isBlue:boolean) => css`
  color: ${isBlue ? 'blue' : 'red'};
  font-weight: ${isBold ? 'bold':'normal'}
`

type StyledDynamicTextProps = {
  isBlue:boolean;
  isBold:boolean;
}

const StyledDynamicStyle = styled.div<StyledDynamicTextProps>`
    color: ${({isBlue}) => isBlue ? 'blue' : 'red'};
    font-weight: ${({isBold}) => isBold ? 'bold':'normal'}
`

export default EmotionComp;