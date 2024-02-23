# TanStack Query

[TanStack | High Quality Open-Source Software for Web Developers](https://tanstack.com/query/v5)

[https://github.com/ssi02014/react-query-tutorial](https://github.com/ssi02014/react-query-tutorial)

# Installation

[Installation | TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/installation)

```bash
npm i @tanstack/react-query
```

# API

## **QueryClient**

[QueryClient | TanStack Query Docs](https://tanstack.com/query/latest/docs/reference/QueryClient)

### QueryClient란?

- `QueryClient` 를 사용하여 캐시와 상호작용할 수 있다.

```bash
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})
```

### QueryClient 적용하기

- index.js 파일에 다음과 같이 추가했다.

```bash
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

```

- `QueryClientProvider` 를 최상단에서 감싸주고 `QueryClient` 인스턴스를 client props로 넣어 애플리케이션에 연결시켜야 한다.
- 이 context는 앱에서 비동기 요청을 알아서 처리하는 background 계층이 된다.

## Devtools

[Devtools | TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/devtools)

- react-query 전용 devtools
- devtools는 기본값으로 `process.env.NODE_ENV === 'development'` 인 경우에만 실행된다.
  - 일반적으로 개발 환경에서만 적용하도록 설정되어 있음

### Devtools 패키지 설치

```bash
$ npm i @tanstack/react-query-devtools
# or
$ pnpm add @tanstack/react-query-devtools
# or
$ yarn add @tanstack/react-query-devtools
```

### Devtools 적용하기

```bash
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <App />
  </QueryClientProvider>
);
```

### options

- **`initialIsOpen: Boolean`**
  - `true` 이면 개발 도구가 기본적으로 열려 있도록 설정할 수 있다.
- **`position?: "top" | "bottom" | "left" | "right"`**
  - 기본값 :  **`bottom`**
  - react query devtools 패널의 위치
- 이 외의 options
  - buttonPosition
  - client
  - errorTypes
  - styleNonce
