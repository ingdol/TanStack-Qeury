function useState(init) {
  let _val = init;
  const state = _val;
  const setState = (newVal) => {
    _val = newVal;
  };

  return [state, setState];
}

export default useState;
