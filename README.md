# 디자인 시스템 poc

음.. 디자인 시스템이라고 하면 말이 넘 거창한데, 그냥 프로젝트 안에서 스타일 어캐할지 실험해보는 것임  

emotion이랑 styled-components를 비교할것이고, styled와 css props도 한번 볼거임  
글로벌 스타일 어떻게 줄지, design token들은 어떻게 관리할지 생각도 해봄

## design token

- 가장 간단하게는 객체로 정의하고, TS로 타입을 맞춘다음에, 컴포넌트에서 그대로 사용할 수 있도록 하는게 제일 간단하고 컴포넌트에 잘 붙고, 텍스트에서 토큰을 강제할 수 있음
- color, opacity같은 경우는 확실히 팔레트가 필요한데, 폰트 크기같은 경우는 조금 커스텀의 여지를 줘도 될거같음(rem?)
- 색깔 표현은 이런식으로

```js
const palette = {
  /* gray */
  gray0: '#F8F9FA',
  gray1: '#F1F3F5',
  gray2: '#E9ECEF',
  gray3: '#DEE2E6',
  gray4: '#CED4DA',
  gray5: '#ADB5BD',
  gray6: '#868E96',
  gray7: '#495057',
  gray8: '#343A40',
  gray9: '#212529',
  /* red */
  /* teal */
};
```

## 사이즈 단위 

일반적으로는 px같은 절대단위보다 rem, em, %같은 상대적인 단위가 더 추천된다.

rem : 단위가 적용된 html 태그의 글자 크기(font-size)에 비례한다.

html태그에서 기본 글자 크기로 16픽셀을 가지고 있는데, 10픽셀로 하면 rem 단위가 16배수가 아니라 10배수가 되어 스타일을 적용하기 편해진다.
em, rem모두 렌더링시 px로 변환되어 페인팅된다.

절대 단위는 반응형 웹에 추천되지 않는다. 픽셀은 한번 값을 설정하면 변경하기가 어렵다. 모니터마다 이미 1px이 어떤 수치인지 다 정해져있기 때문에 반응형 웹 작성에 그다지 효용이 없다. 대신에 rem같은 단위는 html 태그의 font-size를 바꿔주면 모든 요소의 글자 크기를 다 바꿀 수 잇음.

웹 접근성에 악영향을 미칠 가능성이 존재한다. 브라우저에서 유저는 default font size를 설정할 수 있어야 하는데 고정값인 픽셀로 크기를 지정한다면, 비율에 따라 확대를 하거나 하기가 힘들어진다.

> The user needs to be able to resize the text to 200% of its size anywhere on the page, without the text being cut off or overlapping other text. **The font size should be defined in relative units, such as percentages, em or rem. It is not possible to zoom text set in pixels independently from the rest of the page in some browsers.** While the other units calculate the font size from the parent element, rem calculates the font size from the root element. Consider the following two declarations: - W3C

## styled component vs emotion

### 환경

emotion의 css props를 사용하기 위해서는 jsx fragma 설정이 필요한데 babel이나, tsc를 사용하고 있다면 jsx 옵션을 변경해 적용해줄 수 있음. 바벨 플러그인이 필요할 수 있음.

### 데브 모드에서의 style

둘다 dev모드에서는 head 태그에 스타일시트를 넣는다. 생긴게 살짝 다름. emotion은 데브모드에서 해쉬한 클래스 이름에 적용한 스타일 요소 혹은 styled컴포넌트의 이름과 소스맵(이거 어따 써먹는걸까)까지 제공하는데, styled component는 그런거 없고 그냥 해쉬한 클래스값만 뱉는다.

![헤드스타일](image/head.png)

prod 모드에서는 CSSOM을 직접 건드리는 방식으로 동작한다고 한다.

그리고 emotion은 동적 스타일을 새롭게 처리할때마다 style 태그를 계속 추가하고 없애지 않는다. styled-components는 하나의 style 태그에 때려박는다. 

### 동적 요소 스타일링과 부하
#### css props vs styled

- emotion이나 styled-components를 쓰나 인터페이스는 그냥 동일하다. 컴포넌트 만들어줘야 되고, prop필요할 경우 타입선언도 해줘야함
- cssprops는 그에비해 그냥 함수다

#### 성능

당연히 단순한 비교는 어려울 것이겠고, 앱이 아주 복잡해기지 전까지는 앱 성능 전반에 크나큰 영향을 주지는 않을...거라고 생각하지만 대충 동적 스타일 토글하면 무슨 일들이 일어나는지 파악해보자

emotion css props - 8ms정도, 제일 길다
![헤드스타일](image/css-props.png)

styled와 다른 일이 추가로 일어나고 그게 약간 병목?이 되는거 같은데 그거는 이부분이다. 그리고 밑에 code compile가 짧은 시간에 여러번 일어난다. 

![헤드스타일](image/bottleneck.png)

새로운 스타일을 만들어낼 때 diffing 비용을 지불하는 듯한 느낌적인 느낌이다. compile code가 여러번 일어나는게 찝찝하고... 확실히 styled가 더 성능이 좋다.

흠.. 인터페이스가 좀더 편리하다고 생각해서 종강시계에는 사용했었음. 원래의 html 태그를 가리지 않는 방식으로 스타일링이 가능하고, 함수를 통해 새로 컴포넌트를 만들어내는 것보다는 간단히 스타일링을 할 수 있을거라고 생각했는데...

나중에 종강시계에 zero runtime에 가까운 css-in-js로 리팩토링해야겠다 싶긴 하다.

emotion styled - 4ms정도
![헤드스타일](image/emotion-styled-comp.png)

styled류는 compile code가 1~2번밖에 일어나지 않았다. 뭔가 styled컴포넌트는 스타일을 적용하는 방식이 [HOC의 그것과 흡사](https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/models/StyledComponent.ts)하기 때문에 컴파일을 다시 할 필요 없이 그냥 컴포넌트 재랜더링 정도만 하면 되서 그런건가 싶기도. 잘은 모르겠지만 확실히 매커니즘적인 차이가 존재할것 같다.

styled component - 4ms정도
![헤드스타일](image/styled-component.png)

 https://github.com/jsjoeio/styled-components-vs-emotion 

인터페이스가 살짝 아쉽긴 하지만, styled 써야겠다! 
또한 styled는 스타일을 오버라이딩하기 좋다는 장점도 있긔

### 기타 등등

(번들/지집)

옛날에는 확실히 emotion이 styled-component보다 작았던거 같은데, 번들포비아로 보니까 emotion/styled는 10.9/4.8, emotion/react는 20.8/7.7,  styled components는 다해서 33.4/12.7. 또이또이 한듯??? 아니 오히려 styledComponent는 나눠놓지 않았으니까 번들 크기는 비슷한데 이쪽이 더 기능이 많은거 아닌가??

구욷이~ 따지자면 emotion react를 안쓰고 전역 스타일은 걍 CSS-loader, style-loader를 활용하고, theming은 걍 css variables로 하고, CSS그냥 쌩으로 작성해 html에 붙이는 방식으로 작성한다면, styled만 사용하게 될테니 굳이 아껴서 적게 쓰려고 한다면 emotion이 좀 더 유리한듯.(4kb로 가능, 그렇지만 공통으로 쓰는 CSS같은건 필요하지 않을까..?) 혹은 @emotion/react만 사용하거나

성능은 5가 나오고 나서는 [이모션보다 빨라졌다!](https://yumyumlog.tistory.com/240)

엥 근데 번들포비아 보니까 styled component 자체에 emotion의 모듈 몇가지를 의존성을 갖고있당

물론 SWC를 사용하는 Next라면 현재 Styled Component쓰는게 나을지도

## global style

CSS-IN-JS 이용 VS 그냥 HTML같은데다가 붙이기

- 효과가 상이하기 때문에 상황에 맞춰서 쓰면 될듯?
- SSR 여부에 따라 달라질 수도 있을것 같다. createGlobalStyle같은 API는 어쨌든 클라이언트 렌더링단에서 유효하기 시작한 것이기 때문에..
- CSR앱을 만든다고 생각할때, 가장 빠르게 로딩되어야하는 CSS는 쌩으로 작성해서(초기 화면을 특정 스타일로 채워야하는 경우) HTML에 붙이는 방법으로 할 수도 있을듯? 폰트라던가 이런거 CSS로 받는다치면..

## theme

- theme provider을 사용하면 SSR에 제대로 대응할 수 없음 : 자바스크립트 로드 이전에는 어떤 탭을 보여줄지 알 수 없음. CSR위주라면 크게 상관 없을수도 있음. SSR, Next를 사용한다면 사용자가 설정한 쿠키를 이용해서 테마를 설정해가지고 가져올 수 있음.
- CSS Variable을 사용해서 data 속성과 바인딩시키기 : CSS Variable은 글로벌 설정, 원하는 곳에 theme 변수를 넣어준다.
- Theme을 적용할 곳과 아닐 곳? : 만약에 theme을 적용한다 치면 색깔은 커스텀의 여지가 없거나 적어야 할 것.
- CSS 변수 선언할때 CSS로 바로 작성하지 않고, 객체로 작성한 다음에 CSS 변수로 선언하는 유틸 함수를 만들어 구현. 실수 방지에 도움.
- 그리고 theme 상태는 전역 스토어, 혹은 useContext(자주 바뀌지 않는 스타일이고 전체가 다 렌더링되므로 theme의 경우에는 무난)에 저장 - 토글 등으로 클라이언트 단에서 바뀌어야 함