import logo from './logo.svg';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function App() {
  const getRepos = async () => {
    return await axios
      .get('https://api.github.com/repos/tannerlinsley/react-query')
      .then((res) => res.data);
  };

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['repoData'],
    queryFn: getRepos,
  });

  if (isPending) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="App">
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? 'Updating...' : ''}</div>
    </div>
  );
}

export default App;
