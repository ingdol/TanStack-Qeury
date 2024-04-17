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

export default React;
