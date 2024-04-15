import { Header } from './Header';
import React from './useState';

export default function App() {
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

  return (
    <div>
      <Header />
      {/* <h1>Home</h1> */}
    </div>
  );
}
