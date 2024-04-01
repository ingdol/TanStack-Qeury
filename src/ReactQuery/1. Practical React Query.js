import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ul>
        <li>Open the Modal</li>
        <li>
          It will load a random number and show it, but not put it to state
        </li>
        <li>Re-focus the window - the value will still update</li>
        <li>
          Change the value: Your draft now takes precedence and the query is
          disabled
        </li>
        <li>
          Close the modal and open it again: No loading spinner, value will
          update
        </li>
      </ul>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      {isOpen && <Modal close={() => setIsOpen(false)} />}
    </div>
  );
}
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const useRandomValue = () => {
  const [draft, setDraft] = useState(undefined);
  const { data, ...queryInfo } = useQuery({
    queryKey: ['random'],
    queryFn: async () => {
      await sleep(1000);
      return Promise.resolve(String(Math.random()));
    },
    enabled: typeof draft === 'undefined',
  });

  return {
    value: draft ?? data,
    setDraft,
    queryInfo,
  };
};

function Modal({ close }) {
  const {
    value,
    setDraft,
    queryInfo: { isLoading, error },
  } = useRandomValue();

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        paddingTop: '10px',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '80%',
          height: '25vh',
          margin: 'auto',
          backgroundColor: 'white',
        }}
      >
        <div>
          {isLoading && 'Loading...'}
          {error && 'error'}
          {value !== undefined && (
            <input
              type="text"
              value={value}
              onChange={(event) => setDraft(event.target.value)}
            />
          )}
          <span style={{ cursor: 'pointer' }} onClick={close}>
            &times;
          </span>
        </div>
      </div>
    </div>
  );
}
