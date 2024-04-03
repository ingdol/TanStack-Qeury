import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Header } from './Header';

export const UserInfoPage = () => {
  const { data, isLoading, isFetching, isError, error } = useUserInfoData(1);

  console.log({ isLoading, isFetching });

  if (isLoading) {
    return <h2>로딩 중 ...</h2>;
  }

  if (isFetching) {
    return <h2>서버 요청 중 ...</h2>;
  }

  if (isError) {
    return <h2 style={{ color: 'red' }}>{error.message}</h2>;
  }

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <p>ID : {data?.id}</p>
        <p>name : {data?.name}</p>
        <p>username : {data?.username}</p>
      </div>
    </>
  );
};

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
