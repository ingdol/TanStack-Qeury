import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';

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
  const { data } = useUserInfoData(1);
  return <div>{data?.id}</div>;
}

export const getUserInfo = async ({ queryKey }) => {
  const userId = queryKey[1];
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  return response?.data;
};

export const useUserInfoData = (userId) => {
  return useQuery({
    queryKey: ['user-info', userId],
    queryFn: getUserInfo,
  });
};
