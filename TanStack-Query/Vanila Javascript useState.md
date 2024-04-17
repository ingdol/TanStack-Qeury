# Vanila Javascript useState

[https://github.com/FE-Lex-Kim/-TIL/blob/master/React/Vanilla Javascript useState.md](https://github.com/FE-Lex-Kim/-TIL/blob/master/React/Vanilla%20Javascript%20useState.md)

- useState는 클로저를 통해 동작한다.

> 클로저란?

- 자바스크립트는 렉시컬 스코프이다.
- **렉시컬 스코프는 함수가 호출되었을 때, 상위 스코프를 기억하는 것이 아니라 정의 되었을 때 상위 스코프를 기억한다는 의미이다.**
- 따라서 외부 함수 안에 내부 함수가 반환된다면 외부 함수의 생명 주기는 종료되고 내부 함수는 외부 함수보다 더 긴 생명주기를 가진다.
- 이때 내부 함수가 외부 함수의 스코프에 있는 변수를 참조한다면, 외부 함수의 변수는 그대로 보존되어 있다. ⇒ 변수 이름을 “**자유 변수**”라고 부른다.
- 이렇게 내부함수가 외부함수보다
  - 1.  생명주기가 더 길고
  - 2.  자유변수를 가지고 있다면
  - 이러한 내부함수를 클로저라고 부른다.
    >

# useState 기초

- 기초적인 방법

```jsx
function useState(init) {
  let _val = init;
  const state = _val;
  const setState = (newVal) => {
    _val = newVal;
  };

  return [state, setState];
}

const [count, setCount] = useState(1);
console.log('count: ', count); // 1
setCount(2);
console.log('count: ', count); // 1
```

- 위와 같은 초기값은 할당되지만 `setCount` 를 한다고 해도 원하는 값이 나오지 않는다.
- 당연히 `useState` 내부에서 `state` 에 할당하지 않았기 때문이다.

# count 값 갱신

- count 값이 실시간으로 갱신되게 만든어본다.

```jsx
function useState(init) {
  let _val = init;
  const state = () => _val;
  const setState = (newVal) => {
    _val = newVal;
  };

  return [state, setState];
}

const [count, setCount] = useState(1);
console.log('count: ', count()); // 1
setCount(2);
console.log('count: ', count()); // 2
```

- `useState` 내부에서 state를 함수로 만들어서 호출시키면 변경된 `_val` 값이 반환되게 만들어서 정상적으로 보이게 된다.

# React 모듈 생성

- 최대한 실제와 비슷하게 React 모듈 안에 넣어서 만든다.

```jsx
const React = (() => {
  function useState(init) {
    let _val = init;
    const state = () => _val;
    const setState = (newVal) => {
      _val = newVal;
    };

    return [state, setState];
  }
  return { useState };
})();

const [count, setCount] = React.useState(1);
console.log('count: ', count()); // 1
setCount(2);
console.log('count: ', count()); // 2
```

# 예제를 위한 component 생성

- 함수형 컴포넌트에서 click 이벤트가 발생했을 때 `setCount(count + 1)` 이 실행되어서 값이 1씩 증가한다고 가정한다.

```jsx
const React = (() => {
  let _val;
  function useState(init) {
    // 만약 _val 값이 없으면 init을 넣어준다.
    // 가장 초기화할 때 _val 값이 없으니 init을 넣어준다.
    const state = _val || init;
    const setState = (newVal) => {
      _val = newVal;
    };

    return [state, setState];
  }

  function render(Component) {
    const C = Component();

    // 단순하게 state 값이 디버그 콘솔에 보이게 한다.
    C.render();

    return C;
  }

  return { useState, render };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  return {
    render: () => console.log(count),
    click: () => setCount(count + 1),
  };
}

const Test = React.render(Component);
Test.click();
const Test2 = React.render(Component);
```

- `component` 는 반환하는 값이 `render` 와 `click` 메서드를 담고 있는 객체이다.
- 반환되어진 객체의 메서드인 render는 현재 `count` 값을 알려준다.
- click은 `setCount` 가 발생해 `count + 1` 해준다.
- React 함수 내부에 `render` 함수를 만들어서 인수에 `Component` 를 받는다.
- **함수형 컴포넌트**이다 보니 `Component` 가 `click` 또는 `type` 이벤트가 발생하면 다시 호출한다.
- 따라서 Component가 다시 호출되므로 내부의 **useState가 다시 호출되고 초기값이 다시 반환**되면 안된다.
  - 이전에 저장된 값이 있다면(setState로 추가된 값이 있다면) 가장 마지막에 들어간 값을 사용해야 한다.
- `React.render(Component)` 를 실행하면 현재 해당 `Component.render` 를 호출해 state 값을 디버그 콘솔에 보여준다.
- `React.render(Component)` 가 반환하는 값은 인수로 들어간 `Component` 가 된다.
- 이제 `useState` 를 사용해서 나온 `state` 값과 `setState` 값을 편하게 컴포넌트에서 보여지듯 구현한다.

```jsx
function useState(init) {
  // 만약 _val 값이 없으면 init을 넣어준다.
  // 가장 초기화할 때 _val 값이 없으니 init을 넣어준다.
  // Component를 두 번째 호출할 때는 _val에 값이 있으므로 init 값이 들어간다.
  console.log('_val :', _val);
  console.log('init :', init);
  const state = _val || init;
  console.log('state :', state);
  const setState = (newVal) => {
    _val = newVal;
  };

  return [state, setState];
}
```

- `_val` 값이 없어서 초기 `init` 의 값이 `state` 변수에 담기고
  - `setState` 를 통해 `count + 1` 을 하면 기존 `_val` 변수에 `newVal` 이라는 새로운 값이 업데이트 된다.
  ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled.png)

# useState를 여러 번 호출

- Component 내부에서 state를 여러 개 관리하기 위해서 여러 번 호출한다면
  - 결과적으로는 정상 동작하지 않는다.

```jsx
const React = (() => {
  let _val;
  function useState(init) {
    // 만약 _val 값이 없으면 init을 넣어준다.
    // 가장 초기화할 때 _val 값이 없으니 init을 넣어준다.
    // Component를 두 번째 호출할 때는 _val에 값이 있으므로 init 값이 들어간다.
    console.log('_val :', _val);
    console.log('init :', init);
    const state = _val || init;
    console.log('state :', state);
    const setState = (newVal) => {
      _val = newVal;
    };

    return [state, setState];
  }

  function render(Component) {
    const C = Component();

    // 단순하게 state 값이 디버그 콘솔에 보이게 한다.
    C.render();

    return C;
  }

  return { useState, render };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState('Apple');

  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: (nextText) => setText(nextText),
  };
}

const Test = React.render(Component); // {count : 1, text: 'Apple'}
Test.click();
const Test2 = React.render(Component); // {count : 2, text: 2}
Test2.type('Orange');
const Test3 = React.render(Component); // {count : 'Orange', text: 'Orange'}
```

![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%201.png)

### 코드 동작 프로세스

1. Component가 `React.render` 에 의해 호출된다.
2. Component 내부의 `setState` 가 호출되어서 초기값인 1이 count에 들어간다.
3. `useState` 가 두 번째로 호출되어 초기값인 ‘Apple’이 text 안에 들어간다.
4. `test.click()` 이 호출되어지고 `setCount(count + 1)` 이 호출된다.
   1. `setCount` 로직을 보면 React 스코프의 `_val` 변수에 `count + 1` 값을 할당한다.
5. Component가 `React.render` 에 의해 호출된다.
   1. 이 때, 내부 동작을 보면 첫 번째 `useState` 가 호출되고 초기값 1이 들어가 있다.
   2. useState의 내부 로직에 `const state = _val || init;` 는 `_val` 에 값이 없다면 `init` 인 초기밧이 들어간다는 로직이다.
   3. 4.a 동작에 의해 이미 `_val` 값에는 `count + 1` 가 되어, 값이 2로 이미 할당되어 있다.
   4. 따라서 state의 값은 2가 된다.
   5. 두 번째 `useState` 도 마찬가지로 인수에 `"Orange"` 가 들어가 있지만 로직에 의해 text는 2가 된다.
6. 두 번째 `test.click()` 도 위와 같은 로직에 의해 동작하게 된다.

# 배열에 state 저장

- `_var` 에 저장했던 게 문제였기 때문에 이전에 정상 동작하지 않았다.
- 그래서 state들을 배열 안에 저장한다면 어떨까?

```jsx
const React = (() => {
  let hooks = [];
  let idx = 0;
  function useState(init) {
    // 만약 _val 값이 없으면 init을 넣어준다.
    // 가장 초기화할 때 _val 값이 없으니 init을 넣어준다.
    console.log('<useState 함수 시작>');
    console.log('init : ', init);
    console.log('hooks[idx] : ', hooks[idx]);
    let state = hooks[idx] || init;
    console.log('idx 증가하기 전 idx 값 : ', idx);
    const setState = (newVal) => {
      console.log('--- setState 함수 시작 ---');
      console.log('새로 들어온 newVal : ', newVal);
      hooks[idx] = newVal;
      console.log('setState된 후에 hooks : ', hooks);
      console.log('--- setState 함수 끝 ---');
    };
    idx++;
    console.log('idx 증가하고 나서 idx 값 : ', idx);
    console.log('최종 state : ', state);
    return [state, setState];
  }

  function render(Component) {
    const C = Component();

    // 단순하게 state 값이 디버그 콘솔에 보이게 한다.
    C.render();

    return C;
  }

  return { useState, render };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState('Apple');

  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: (nextText) => setText(nextText),
  };
}

const Test = React.render(Component); // { count: 1, text: 'Apple'}
Test.click();
const Test2 = React.render(Component); // { count: 2, text: 'Apple'}
Test2.type('Orange');
const Test3 = React.render(Component); // { count: 'Orange', text: 'Apple'}
```

### 현재 로직

1. `useState` 가 호출되면 `idx` 값이 `1` 씩 증가한다.
2. `idx` 의 목적은 `setState` 를 호출하면 `idx` 인덱스 위치에 새로운 값을 할당한다.
3. `useState` 가 호출되면 가장 마지막에 `setState` 한 값이 있으면 그 값을 사용한다. `( let state = hooks[idx] || init; )`
4. 이후 `idx` 값을 `1` 증가시켜 `hooks` 의 새로운 인덱스 위치에 넣을 준비를 한다.

### 예제 코드 동작 프로세스

1. `Component` 최초 호출
   1. 내부의 `useState(1)` 호출

      - `const [count, setCount] = React.useState(1);`

   2. `state` 값은 `hooks[idx]` 값이 `undefined` 이므로 `init` 값이 들어가 `state` 는 `1` 이 된다.

      - `let state = hooks[idx] || init;`

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%202.png)

   3. `idx++` 는 기존의 `idx === 0` 값에서 `1` 로 증가한다.

      - `let idx = 0;`

      - `idx++;`

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%203.png)

   4. 두 번째 `useState('Apple')` 가 호출된다.

      - `const [text, setText] = React.useState('Apple');`

   5. `hooks[idx](idx === 1)` 값이 `undefined` 이므로 init 값인 `'Apple'` 이 들어간다.

      - `let state = hooks[idx] || init;`

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%204.png)

   6. 이후 `idx` 는 `2` 로 증가한다.

      - `let idx = 0;`

      - `idx++;`

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%205.png)
2. `Test.click` 호출
   1. `setCount(count + 1)` 이 호출된다.

      - `Test.click();`

      - `click: () => setCount(count + 1)`

   2. 현재 `idx === 2` 이므로 `hooks[2] = 2` 값이 된다.

      ```
      const setState = (newVal) => {
            hooks[idx] = newVal;
          };
      ```

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%206.png)
3. `Component` 두 번째 호출
   1. click 이벤트 핸들러로 인해 함수형 컴포넌트인 `Component` 는 두 번째 호출이 된다.
   2. `Component` 의 로직이 다시 실행돼서 `useState(1)`이 호출된다.
   3. `useState` 호출 로직 내부에 `let state = hooks[idx] || init;` 가 있는데 현재 `idx === 2` 이므로 `hooks[2]` 값은 `2` 이다. 따라서 `state` 값은 `2` 가 된다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%207.png)

   4. 이후 `idx++` 이므로 `idx` 값은 `3` 으로 증가한다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%208.png)

   5. 두 번째 `useState('Apple')` 이 호출된다.
   6. 현재 `idx === 3` 이므로 `hooks[3]` 값은 `undefined` 이다. 따라서 `state` 값은 `init` 인 `'Apple'` 가 들어간다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%209.png)

   7. 이후 `idx++` 로 인해 `idx` 값은 `4` 로 증가한다.
   8. 현재까지 `state = { count : 2, text : Apple }`

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2010.png)
4. `Test2.type` 호출
   1. `setText('Orange')` 가 호출된다.

      - `Test2.type('Orange');`

   2. 현재 `idx === 4` 이므로 `hooks[4]` 는 `'Orange'` 가 들어가게 된다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2011.png)
5. `Component` 세 번째 호출
   1. `type` 이벤트 핸들러로 인해 함수형 컴포넌트인 `Component` 는 세 번째 호출이 된다.
   2. `Component` 의 로직이 다시 실행돼서 `useState(1)` 이 호출된다.
   3. `useState` 호출 로직 내부에 현재 `idx === 4` 이므로 `hooks[4]` 값은 `Orange` 이다. `state` 값은 `Orange` 이다.
   4. 이후 `idx++` 이므로 `idx` 값은 `5` 로 증가한다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2012.png)

   5. 두 번째 `useState('Apple')` 호출된다.
   6. 현재 `idx === 5` 이므로 `hooks[5]` 값은 `undefined` 이다. 따라서 `state` 값은 `init` 인 `'Apple'` 가 들어간다.
   7. 이후 `idx++` 로 인해 `idx` 값은 `6` 으로 증가한다.
   8. 현재까지 `state = { count : 'Orange', text : 'Apple'}`

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2013.png)

### 지금까지의 로직에서

- `useState` 가 여러 개일 때, 컴포넌트의 첫 번째로 호출되는 `useState` 종류와 호출된 `setState` 의 종류가 일치하지 않으면 값이 `setState` 값으로 덮어진다는 점이다.
- 그렇다고 항상 `Component` 의 첫 번째 `useState(예제에서는 count state)` 인 `setState` 만 호출할 수도 없다.
- 다른 `useState`의 `setState` 도 호출하는 이벤트도 있기 때문이다.

# 각 useState마다 state를 저장할 index를 지정

- 매번 hooks 배열의 다른 index에 state를 저장하면서 마지막 index에 위치한 state 값을 참조한 방법은 단점이 컸다.
- 따라서 각각 useState마다 배열에 저장할 state의 고유 index를 지정하면 된다.

```jsx
const React = (() => {
  let hooks = [];
  let idx = 0;
  function useState(init) {
    // 만약 _val 값이 없으면 init을 넣어준다.
    // 가장 초기화할 때 _val 값이 없으니 init을 넣어준다.
    console.log('<useState 함수 시작>');
    console.log('init : ', init);
    console.log(`hooks[${idx}] : `, hooks[idx]);
    let state = hooks[idx] || init;
    let _idx = idx;
    console.log('idx 증가하기 전 _idx 값 : ', _idx);
    const setState = (newVal) => {
      console.log('--- setState 함수 시작 ---');
      console.log('새로 들어온 newVal : ', newVal);
      console.log('현재 _idx 값 : ', _idx);
      hooks[_idx] = newVal;
      console.log('setState된 후에 hooks : ', hooks);
      console.log('--- setState 함수 끝 ---');
    };
    idx++;
    console.log('idx 증가하고 나서 idx 값 : ', idx);
    console.log('최종 state : ', state);
    return [state, setState];
  }

  function render(Component) {
    // render가 호출되면 idx 값을 0으로 초기화 한다.
    idx = 0;
    const C = Component();

    // 단순하게 state 값이 디버그 콘솔에 보이게 한다.
    C.render();

    return C;
  }

  return { useState, render };
})();

function Component() {
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState('Apple');

  return {
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: (nextText) => setText(nextText),
  };
}

const Test = React.render(Component); // { count: 1, text: 'Apple'}
Test.click();
const Test2 = React.render(Component); // { count: 2, text: 'Apple'}
Test2.type('Orange');
const Test3 = React.render(Component); // { count: 2, text: 'Orange'}
```

### 예제 코드 동작 프로세스

1. 최초 Component 호출
   1. `useState(1)` 을 호출한다.
   2. `idx` 가 `0` 이고 `hooks[idx]` 값은 비어있으므로 `state` 는 `init` 값인 `1` 이 된다.
   3. `_idx` 변수에 현재 `idx` 를 저장한다.
   4. `idx` 의 값을 `1` 만큼 증가시킨다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2014.png)

   5. `useState('Apple')` 을 호출한다.
   6. `idx` 가 `1` 이고 `hooks[idx]` 값은 비어있으므로 `state` 는 `init` 값인 `Apple` 이 된다.
   7. `_idx` 변수에 현재 `idx` 를 저장한다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2015.png)
2. `Test.click()` 호출
   1. `setCount(count + 1)` 이 호출된다.
   2. `setCount` 함수가 정의되었을 시점에 상위 스코프의 `idx` 의 값은 `0` 이였다. 따라서 `_idx` 도 `0` 이였고 `setCount` 가 클로저로 반환되고 이때 `_idx` 값은 자유변수로 해당 시점에 호출된 `useState` 의 `_idx` 값을 가지고 있다. 따라서 `hooks[0]` 값에 `2` 를 할당한다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2016.png)
3. 두 번째 Component 호출
   1. `React.render` 가 호출되면 `idx` 값을 `0` 으로 초기화한다. 그 이유는 `useState` 의 `state` 가 저장되는 위치를 순서대로 하기 위함이다.(useState의 순서라고 생각하면 쉽다.)
   2. `useState(1)` 을 호출한다.
   3. `idx` 가 `0` 이고 `hooks[0]` 값은 `2`였으므로 `state` 는 `2` 가 된다.
   4. `_idx` 변수에 현재 `idx` 를 저장한다.
   5. `idx` 의 값을 `1` 증가시킨다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2017.png)

   6. `useState('Apple')` 을 호출한다.
   7. `idx` 가 `1` 이고 `hooks[1]` 값은 `'Apple'` 이였으므로 `state` 는 `'Apple'` 이 된다.
   8. `_idx` 변수에 현재 `idx` 를 저장한다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2018.png)
4. `Test2.type` 호출
   1. `setText('Orange')` 가 호출된다.
   2. `setText` 함수가 정의되었을 시점에 상위 스코프의 `idx` 의 값은 `1` 이였다. 따라서 `_idx` 도 `1` 이였고 `setText` 가 클로저로 반환되고 이때 `_idx` 값은 자유변수로 해당 시점에 호출된 `useState` 의 `_idx` 값을 가지고 있다. 따라서 `hooks[1]` 값에 `'Orange'` 를 할당한다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2019.png)
5. 세 번째 Component 호출
   1. `React.render` 가 호출되면 `idx` 값을 `0` 으로 초기화한다.
   2. `useState(1)` 을 호출한다.
   3. `idx` 가 `0` 이고 `hooks[0]` 값은 `2` 였으므로 `state` 는 `2` 가 된다.
   4. `_idx` 변수에 현재 `idx` 를 저장한다.
   5. `idx` 의 값을 `1` 증가시킨다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2020.png)

   6. `useState('Apple')` 을 호출한다.
   7. `idx` 가 `1` 이고 `hooks[1]` 값은 `'Orange'` 이였으므로 `state` 는 `'Orange'` 가 된다.
   8. `_idx` 변수에 현재 `idx` 를 저장한다.

      ![Untitled](Vanila%20Javascript%20useState%20eb2e6ae31a3146a6a06d1daf91f3870d/Untitled%2021.png)

- 현재 useState가 호출된 순서에 따라서 index 위치가 정해지고 있다.
- 따라서 useState가 조건문 또는 반복문에 따라서 호출 유무에 따라 결정하면 state가 저장된 배열(React 함수의 hooks 변수)의 index의 값을 불러오거나 저장할 수 없을 것이다.

### 최상위(at the Top Level)에서만 Hook을 호출해야 한다.

- 실제 공식 홈페이지에서도 다음과 같은 내용을 담고 있다.

[Hook의 규칙 – React](https://ko.legacy.reactjs.org/docs/hooks-rules.html)

- 반복문, 조건문 혹은 중첩된 함수 내에서 Hook을 호출하면 안된다.
- 대신 early return이 실행되기 전에 항상 React 함수의 최상위에서 Hook을 호출해야 한다.
  - 이 규칙으로, 컴포넌트가 렌더링될 때마다 항상 동일한 순서로 Hook이 호출되는 것이 보장된다.
- 이러한 점은 React가 `useState` 와 `useEffect` 가 여러 번 호출되는 중에 Hook의 상태를 올바르게 유지할 수 있도록 해준다.

# 정리

- 각각 useState 별로 state를 저장할 고유의 index 위치를 만든다.
- 최초의 index는 Component에서 정의된 useState에서 시작해서 다른 useState가 호출될 때마다 증가한다.

- 실제 useState는 React에 따르면 최적화를 위해서 가장 마지막에 비동기로 실행된다고 한다.
