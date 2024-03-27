# 실용적인 React Query

[Practical React Query](https://highjoon-dev.vercel.app/blogs/1-practical-react-query)

# 기본 설정

- React Query는 `stale Time` 이 기본값인 0이여도, 리렌더링될 때마다 `quertFn` 을 호출하지 않음
- 예상치 않게 `refetch` 가 발생했다면, 사용자가 window를 포커스했고 react query가 `refetchOnWindowFocus` 를 실행했을 것임
  - 하지만 React Query v5부터는 `refetchOnWindowFocus` 는 더 이상 `focus` 이벤트를 감지하지 않고, `visibilitychange` 이벤트를 감지함
  - 따라서 개발 환경에서 더 이상 의도하지 않은 `refetch` 가 줄어들 것임
  - 운영 환경에서의 불러오기와 거의 비슷할 것임
- 만약 사용자가 다른 브라우저 탭으로 이동했다가 다시 돌아오면, 자동으로 백그라운드에서 `refetch` 가 자동으로 실행됨
  - 그 동안 서버에서 데이터가 변경되었다면 화면에서 보여지는 데이터가 업데이트 됨
- 이 모든 일은 로딩 스피너가 없이 발생하며, 만약 데이터가 캐시에 이미 있는 것 같을 경우, 리렌더링은 일어나지 않음

- 이러한 현상은 개발 환경에서 더 자주 발생함
  - 특히 브라우저의 개발자 도구와 어플리케이션을 오갈 때마다 데이터 불러오기가 실행

### `gcTime`과 `staleTime`

- `staleTime`
  - 쿼리가 신선한 상태에서 신선하지 않은 상태로 변할 때 까지의 소요 시간
  - 쿼리가 신선한 상태인 동안에는 데이터가 항상 캐시에서만 읽힘 → 네트워크 요청은 발생하지 않음
  - 쿼리가 신선하지 않다면 (기본적이 항상 지정되어 있는) 여전히 데이터는 캐시에서 불러오겠지만 특정 조건에서는 백그라운드에서 `refetch` 가 발생
- `gcTime`
  - 비활성 상태의 쿼리가 캐시에서 제거될 때까지의 시간 → 기본값은 5분
  - 쿼리는 등록된 옵저버가 더 이상 없을 때, 즉 해당 쿼리를 사용하는 모든 컴포넌트가 언마운트되면 비활성 상태로 전환됨
  - 이 설정을 바꾸고 싶다면 대부분의 경우 `staleTime` 을 수정하면 됨

# 쿼리 키를 의존성 배열처럼 다루기

- 여기서 말하는 의존성 배열이란 `useEffect` 훅의 의존성 배열을 가리킴
  - React Query는 쿼리 키가 변경될 때마다 `refetch` 함
  - 어떠한 값이 변할 때마다 데이터를 불러오기를 원한다면, `queryFn` 에 그 값을 매개변수로 전달함
  - `refetch` 를 수동으로 트리거하기 위해 복잡한 효과를 주는 대신 쿼리 키를 활용할 수 있음

```tsx
// 'all', 'open', 'done' 세 가지 값 중 하나만 가질 수 있음
type State = 'all' | 'open' | 'done';

// Todo 항목을 나타내는 타입을 정의
// Todo 객체는 고유한 id와 상태(state) 속성을 가지고 있음
type Todo = {
  id: number;
  state: State;
};

// Todo 객체의 읽기 전용 배열을 나타냄
type Todos = ReadonlyArray<Todo>;

// 주어진 상태에 따라 Todo 목록을 가져오는 비동기 함수를 정의함
const fetchTodos = async (state: State): Promise<Todos> => {
  const response = await axios.get(`todos/${state}`);
  return response.data;
};

// useTodosQuery라는 커스텀 훅을 정의함
// React Query의 useQuery 훅을 사용하여 Todo 목록을 가져옴
export const useTodosQuery = (state: State) =>
  useQuery({
    // queryKey는 'todos'와 주어진 상태로 구성되어 있음
    queryKey: ['todos', state],
    // queryFn은 fetchTodos 함수를 호출하여 데이터를 가져옴
    queryFn: () => fetchTodos(state),
  });
```

- 사용자가 상태를 전환할 때마다 로컬 상태를 업데이트함
  - 데이터가 아직 없다면, ‘all todos’ 캐시에서 데이터를 표시하려고 시도함
  - 사용자에게 ‘done’ 상태의 할 일 목록이 즉시 보여짐
  - 백그라운드에서 데이터 불러오기가 완료되면 업데이트된 목록이 보여질 것임

### 새로운 캐시 항목

- Query Key가 캐시의 키로 사용되기 때문에 ‘all’에서 ‘done’으로 전환할 때마다 새로운 캐시 항목이 생성됨
  - 처음 전환할 때는 하드 로딩 상태가 생길 것임 (아마도 로딩 스피너가 출력될 것임)
  - 이는 이상적이지 않기 때문에, 가능하다면 새로 생성된 캐시 항목을 initialData로 미리 채워둘 수 있
- 다음 예제는 클라인트 사이드에서 할 일 목록에 대한 사전 필터링을 할 수 있음

```tsx
type State = 'all' | 'open' | 'done';

type Todo = {
  id: number;
  state: State;
};

type Todos = ReadonlyArray<Todo>;

const fetchTodos = async (state: State): Promise<Todos> => {
  const response = await axios.get(`todos/${state}`);
  return response.data;
};

export const useTodosQuery = (state: State) =>
  useQuery(
    queryKey: ['todos', state]
    queryFn: () => fetchTodos(state),
    // initialData 함수는 초기 데이터를 설정하는 데 사용
    initialData: () => {

	    // queryClient에서 'todos' 상태의 모든 Todo를 가져온 다음, 주어진 상황에 따라 필터링된 데이터를 반환함
      const allTodos = queryClient.getQueryData<Todos>(['todos', 'all']);
      const filteredData = allTodos?.filter((todo) => todo.state === state) ?? [];

      return filteredData.length > 0 ? filteredData : undefined;
    },
  });
```

- 사용자가 상태를 전환할 때마다, 데이터가 아직 없다면, ‘all todos’ 캐시에서 데이터를 표시하려고 시도함
- 사용자에게 ‘done’ 상태의 할 일 목록이 즉시 보여질 것임
- 백그라운드에서 데이터 불러오기(fetch)가 완료되면 업데이트된 목록이 보여질 것임

# 서버 상태와 클라이언트 상태를 분리한 채로 유지하기

- `useQuery` 로 불러온 데이터를 로컬 상태에 넣으려고 하면 안됨
  - 주된 이유는 해당 로컬 상태에는 React Query에서 해주는 모든 백그라운드 업데이트가 적용되지 않기 때문임
  - 해당 로컬 상태는 ‘복사본’이기 때문에 업데이트 되지 않기 때문임
- 예를 들어, 폼을 위한 기본 값을 불러온 후 데이터가 있을 때 폼을 렌더링할 경우 이 방식을 사용해도 괜찮음
  - 백그라운드 업데이트가 새로운 값을 불러올 가능성이 매우 낮음
  - 불러온다 해도 폼은 이미 초기화된 상태임
- 따라서 의도적으로 이 방식을 사용할 경우, 백그라운드에서 불필요하게 데이터를 다시 불러올 일이 없도록 `staleTime` 을 설정함

```tsx
// initial-form-data

const App = () => {
  const { data } = useQuery({
    queryKey: ['key'],
    queryFn,
    // staleTime은 Infinity로 설정되어 있어서 캐시된 데이터가 항상 사용됨
    staleTime: Infinity,
  })

	// data가 있는 경우에만 컴포넌트를 렌더링함
  return data ? <MyForm initialData={data} /> : null
}

// initialData를 기본 데이터로 설정하여 내부 상태를 관리
const MyForm = ({ initialData }) => {
  const [data, setData] = React.useState(initialData)
  ...
}
```

- 다음 데모에서 중요한 점은 React Query에서 가져온 데이터를 로컬 상태로 관리하지 않는다는 점임
  - 로컬에 데이터의 복사본이 없기 때문에 항상 최신의 데이터를 볼 수 있다는 점이 보장됨

```tsx
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
```

### enabled 옵션은 매우 강력함

- `useQuery` 훅은 동작을 커스터마이징 할 수 있는 많은 옵션을 갖고 있음
- 그 중 `enabled` 옵션은 매우 강력함

1. 종속적인 쿼리

   : 하나의 쿼리에서 데이터를 가져오며 첫 번째 쿼리에서 성공적으로 데이터를 얻은 후에만 두 번째 쿼리를 실행할 수 있음

2. 쿼리를 켜고 끄기
   - `refetchInterval` 로 인해 정기적으로 데이터를 가져올 수 있는 쿼리가 있음
   - 하지만 Modal 팝업이 잠시 열려있는 동안에 화면 뒷부분의 업데이트를 피하기 위해 잠시 멈출 수 있음
3. 사용자의 입력 대기

   : 쿼리 키에 일부 필터 기준을 포함하고 있지만, 사용자가 필터를 적용할 때까지 일시적으로 비활성화 함

4. 사용자 입력 후 쿼리 비활성화

   : 서버 데이터보다 우선시 해야 하는 드래프트(임시) 값이 있는 경우 쿼리를 비활성화할 수 있음

   - 위에 예제 참고

[Disabling/Pausing Queries | TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries#lazy-queries)

### `enabled` : 쿼리 비활성화 및 일시 중지

- 만약 쿼리를 자동으로 실행하지 않도록 비활성화하려면 `enabled = false` 옵션을 사용할 수 있음
- `enabled` 가 `false` 인 경우
  - 쿼리에 캐시된 데이터가 있는 경우, 쿼리는 `status === 'success'` 또는 `isSuccess` 상태로 초기화 됨
  - 쿼리에 캐시된 데이터가 없는 경우, 쿼리는 `status === 'pending'` 및 `fetchStatu === 'idle'` 상태로 시작됨
  - 쿼리는 마운트할 때 자동으로 가져오지 않음
  - 쿼리는 일반적으로 쿼리를 다시 가져오도록 하는 **`invalidateQueries`** 와 **`refetchQueries`** 호출을 무시함
  - useQuery에서 반환된 `refetch` 를 사용하여 쿼리를 수동으로 트리거하여 가져올 수 있음
    - 그러나 `skipToken`과 함께 사용할 수 없음
  - typeScript 사용자는 `enabled = false` 대신 `skipTopen` 을 대체로 선호할 수 있음

## queryCache를 로컬 상태 관리자로 사용하지 말기

- 만약 queryCache(`queryClient.setQueryData`)를 조작하는 경우
  - 낙관적인 업데이트 또는 mutation 이후 백엔드에서 받은 데이터를 작성하는 경우여야만 함
- 백그라운드에서 다시 불러오는 데이터는 현재 데이터를 덮어씌울 수 있
