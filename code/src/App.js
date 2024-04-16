import { Header } from './Header';
import React from './useState';

export default function App() {
  function Component() {
    const [count, setCount] = React.useState(1);
    const [text, setText] = React.useState('Apple');

    return {
      render: () => console.log({ count, text }),
      click: () => setCount(count + 1),
      type: (nextText) => setText(nextText),
    };
  }

  const Test = React.render(Component);
  Test.click();
  const Test2 = React.render(Component);
  Test2.type('Orange');
  const Test3 = React.render(Component);

  return (
    <div>
      <Header />
      {/* <h1>Home</h1> */}
    </div>
  );
}
