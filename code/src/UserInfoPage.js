import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Header } from './Header';
import useUserInfoList from './useUserInfoList';

export const UserInfoPage = () => {
  // const { data, isError, error } = useUserInfoData(1);

  // const { refetch, isLoading, isFetching } = useQuery({
  //   queryKey: ['user-info-2', 2],
  //   queryFn: getUserInfo,
  //   enabled: false,
  // });

  // const { refetch, data, isLoading, isFetching } = useQuery({
  //   queryKey: ['user-list'],
  //   queryFn: () => {
  //     return axios.get('https://jsonplaceholder.typicode.com/users');
  //   },
  //   select: (data) => {
  //     return data.data.map((user) => ({
  //       name: user.name,
  //     }));
  //   },
  // });

  const { refetch, data, isLoading, isFetching } = useUserInfoList();
  console.log(data);

  console.log({ isLoading, isFetching });

  if (isLoading || isFetching) {
    return <h2>로딩중...2</h2>;
  }

  // if (isLoading) {
  //   return <h2>로딩 중 ...</h2>;
  // }

  // if (isFetching) {
  //   return <h2>서버 요청 중 ...</h2>;
  // }

  // if (isError) {
  //   return <h2 style={{ color: 'red' }}>{error.message}</h2>;
  // }

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        {/* <p>ID : {data?.id}</p>
        <p>name : {data?.name}</p>
        <p>username : {data?.username}</p> */}
        {data?.map((user) => (
          <p>{user.name}</p>
        ))}
      </div>
      <button onClick={refetch}>Click this button</button>
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
    // staleTime: 30000,
    // refetchOnMount: false,
    // refetchInterval: 2000,
    // refetchIntervalInBackground: true,
  });
};
