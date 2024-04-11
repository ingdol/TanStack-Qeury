import { Header } from './Header';
import useState from './useState';

export default function App() {
  const [count, setCount] = useState(1);
  console.log('count: ', count);
  setCount(2);
  console.log('count: ', count);

  return (
    <div>
      <Header />
      <h1>Home</h1>
    </div>
  );
}
