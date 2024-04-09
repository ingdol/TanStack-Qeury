import { useParams } from 'react-router-dom';
import { Header } from './Header';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const UserDetailPage = () => {
  // usePath id 값 가져와서
  const { userId } = useParams();

  // 해당 id에 대한 data 요청
  // 1) query Id를 통해 캐시 저장
  // const { isLoading, data, isError, error } = useQuery({
  //   queryKey: ['user-detail', userId],
  //   queryFn: () => {
  //     return axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
  //   },
  // });

  // 2) queryKey를 파라미터로 받는 방법
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ['user-detail', userId],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1];
      return axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    },
  });

  const { data: user2 } = useQuery({
    queryKey: ['user-detail'],
    queryFn: () => {
      return axios.get(`https://jsonplaceholder.typicode.com/users/2`);
    },
  });

  if (isLoading) {
    return <h2>로딩중...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }
  return (
    <>
      <Header />
      <h2>{data.data.name}</h2>
      user 2 : {user2.data.name}
    </>
  );
};
