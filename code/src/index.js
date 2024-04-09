import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import { UserInfoPage } from './UserInfoPage';
import { UserDetailPage } from './UserDetailPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/userInfo',
    element: <UserInfoPage />,
  },
  {
    path: '/userInfo/:userId',
    element: <UserDetailPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </QueryClientProvider>
);
