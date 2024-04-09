import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function useUserInfoList() {
  const { refetch, data, isLoading, isFetching } = useQuery({
    queryKey: ['user-list'],
    queryFn: () => {
      return axios.get('https://jsonplaceholder.typicode.com/users');
    },
    select: (data) => {
      return data.data.map((user) => ({
        name: user.name,
        id: user.id,
      }));
    },
  });

  return { refetch, data, isLoading, isFetching };
}

export default useUserInfoList;
