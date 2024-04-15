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

export default React;
