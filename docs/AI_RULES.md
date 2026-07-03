# 연애판별소 (some2) AI 확장 개발 가이드라인

> 이 문서는 AI가 이 프로젝트에서 코드를 생성하거나 기능을 확장할 때 **반드시 준수해야 하는** 강제 규칙이다.  
> 단 하나의 규칙이라도 어길 경우, 해당 코드는 유효하지 않은 결과물로 간주한다.

**기술 스택 고정값**

| 항목 | 버전 |
|------|------|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Redux Toolkit | 2 |
| TanStack React Query | 5 |
| Axios | 1 |
| Zod | 4 |
| MSW | 2 |
| React Router DOM | 7 |

---

## 1. 아키텍처 및 폴더 규칙 (Architecture & Directory Rules)

### 1-1. 파일 생성 위치 기준

새 파일을 만들 때는 아래 기준표를 따른다. **기준에 맞지 않는 위치에 파일을 절대 생성하지 않는다.**

| 생성할 파일의 성격              | 위치                | 확장자    |
| ----------------------- | ----------------- | ------ |
| Axios 인스턴스, 도메인별 API 함수 | `src/api/`        | `.ts`  |
| Redux 슬라이스 (Slice)      | `src/store/`      | `.ts`  |
| 커스텀 훅 (Custom Hook)     | `src/hooks/`      | `.ts`  |
| 라우트와 1:1 대응되는 페이지 컴포넌트  | `src/screens/`    | `.tsx` |
| 재사용 UI 컴포넌트             | `src/components/` | `.tsx` |
| 도메인 무관 순수 유틸리티 함수       | `src/utils/`      | `.ts`  |
| MSW 핸들러 및 인메모리 DB       | `src/server/`     | `.ts`  |
| 앱 진입점, 레이아웃, 라우터        | `src/`            | `.tsx` |

**계층 간 단방향 의존 방향:**

```
screens → hooks → api
screens → components
hooks   → store
api/client → store (인터셉터 전용)
```

역방향 참조는 절대 허용하지 않는다. 예를 들어 `api/` 계층이 `hooks/`나 `screens/`를 import해서는 안 된다.

---

### 1-2. `.ts` vs `.tsx` 파일 확장자 규칙

**규칙:** JSX 문법(`<태그>`)이 단 한 줄이라도 포함되면 `.tsx`, 그렇지 않으면 반드시 `.ts`를 사용한다.

```
✅ DO   src/hooks/use-sign-in.ts       (JSX 없음 → .ts)
✅ DO   src/store/auth-slice.ts        (JSX 없음 → .ts)
✅ DO   src/screens/sign-in-screen.tsx (JSX 포함 → .tsx)
✅ DO   src/components/button-component.tsx (JSX 포함 → .tsx)

❌ DON'T  src/hooks/use-sign-in.tsx    (JSX 없는데 .tsx 사용)
❌ DON'T  src/store/auth-slice.tsx     (JSX 없는데 .tsx 사용)
```

---

### 1-3. `import type` 강제 규칙

`tsconfig.app.json`에 `"verbatimModuleSyntax": true`가 설정되어 있다.  
**타입만 사용하는 import는 반드시 `import type`을 붙인다.** 값(함수, 클래스, 상수)과 타입을 함께 import할 때는 분리한다.

```typescript
// ✅ DO
import { useSelector } from "react-redux";
import type { StateType } from "../store/store";
import type { ApiError } from "../api/client";

// ❌ DON'T
import { StateType } from "../store/store";
import { ApiError } from "../api/client";
```

---

### 1-4. 파일명 네이밍 규칙

모든 파일명은 **kebab-case**를 사용한다. PascalCase나 camelCase 파일명은 허용하지 않는다.

```
✅ DO    use-memo-mutation.ts
✅ DO    memo-card-components.tsx
✅ DO    auth-slice.ts
✅ DO    local-storage.ts

❌ DON'T  useMemoMutation.ts
❌ DON'T  MemoCardComponents.tsx
❌ DON'T  AuthSlice.ts
```

함수/컴포넌트 내부 식별자(변수, 클래스, 함수명)는 별도 규칙을 따른다 (`3. 코드 스타일` 참고).

---

### 1-5. 제네릭 함수 작성 시 주의사항

`.ts` 파일에서 제네릭 함수를 작성할 때는 화살표 함수와 제네릭 문법이 충돌하지 않는다.  
`.tsx` 파일에서는 `<T>` 가 JSX로 오인될 수 있으므로, 제네릭이 필요한 순수 함수는 반드시 `.ts` 파일에 작성한다.

```typescript
// ✅ DO — .ts 파일 (utils/local-storage.ts)
export const getLocalStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (item === null) return null;
  return JSON.parse(item) as T;
};

// ❌ DON'T — .tsx 파일에 제네릭 유틸 함수 혼입
// (JSX 파서가 <T>를 태그로 해석할 수 있음)
```

---

## 2. 상태 관리 및 비동기 파이프라인 (State & Async Rules)

### 2-1. 상태 종류별 사용 기준

세 가지 상태를 명확히 구분한다. 아무 상태나 편의에 따라 섞어 쓰지 않는다.

| 상태 종류 | 기술 | 사용해야 하는 경우 | 사용하면 안 되는 경우 |
|-----------|------|-------------------|----------------------|
| **전역 클라이언트 상태** | Redux Toolkit | 여러 화면에서 공유되고 서버와 무관한 상태 (인증 토큰, 토스트 알림) | 서버에서 받아온 원격 데이터 |
| **서버 상태** | TanStack React Query | 서버에서 가져오는 모든 데이터 (캐시, 로딩, 에러 포함) | 인증 토큰, UI 전용 상태 |
| **지역 UI 상태** | `useState` | 단일 화면 내에서만 쓰이는 임시 상태 (폼 입력값, 유효성 에러) | 다른 컴포넌트와 공유해야 하는 데이터 |

---

### 2-2. Redux Slice 생성 표준 서식

새로운 슬라이스를 추가할 때는 아래 구조를 반드시 그대로 따른다. 순서도 지킨다.

```typescript
// src/store/{domain}-slice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// 1. 상태 타입 — type 키워드, {SliceName}SliceStateType 네이밍
type ExampleSliceStateType = {
  value: string | null;
};

// 2. 초기 상태
const initialState: ExampleSliceStateType = {
  value: null,
};

// 3. createSlice
const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    // PayloadAction에 명시적 타입을 항상 기입
    setValue: (state, action: PayloadAction<{ value: string }>) => {
      state.value = action.payload.value;
    },
    clearValue: (state) => {
      state.value = null;
    },
  },
});

// 4. actions는 named export, reducer는 default export — 이 구조 고정
export const exampleActions = exampleSlice.actions;
export default exampleSlice.reducer;
```

**store.ts에 슬라이스 등록:**

```typescript
// ✅ DO — src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import toastSlice from "./toast-slice";
import exampleSlice from "./example-slice"; // 신규 슬라이스 추가

const store = configureStore({
  reducer: {
    auth: authSlice,
    toast: toastSlice,
    example: exampleSlice,
  },
});

export type StateType = ReturnType<typeof store.getState>;
export default store;
```

**화면에서 Action 디스패치 방법:**

```typescript
// ✅ DO — 슬라이스명Actions.리듀서명 패턴
dispatch(toastActions.set({ message: "저장되었습니다.", code: 200 }));
dispatch(authActions.signIn({ token }));

// ❌ DON'T — 직접 액션 객체 구성
dispatch({ type: "toast/set", payload: { message: "저장되었습니다.", code: 200 } });
```

---

### 2-3. API 함수 작성 표준 서식

모든 API 함수는 `src/api/` 폴더에 도메인 단위로 분리하고 아래 패턴을 따른다.

**읽기 요청 (GET):**

```typescript
// ✅ DO — src/api/example-api.ts
import { isAxiosError } from "axios";
import client, { ApiError } from "./client";

export const getExamples = async () => {
  try {
    const res = await client.get("/examples");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data.errorCode);
    }
    throw err;
  }
};
```

**쓰기 요청 (POST/PUT/DELETE):**

```typescript
// ✅ DO
export const createExample = async (data: { title: string; body: string }) => {
  try {
    const res = await client.post("/examples", data);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data.errorCode);
    }
    throw err;
  }
};
```

**응답 데이터에 Zod 검증이 필요한 경우 (signIn과 같이 핵심 필드 신뢰도 확보 필요 시):**

```typescript
// ✅ DO — signInRequest 패턴 참고
export const signInRequest = async (data: { email: string; password: string }) => {
  try {
    const res = await client.post("/signin", data);

    const schema = z.object({ token: z.string() });
    const parsed = schema.safeParse(res.data);
    if (parsed.success === false) {
      throw parsed.error;
    }
    return parsed.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data.errorCode);
    }
    throw err;
  }
};

// ❌ DON'T — isAxiosError 체크 없이 에러를 그냥 throw
export const badApiCall = async () => {
  const res = await client.get("/examples"); // try-catch 없음
  return res.data;
};
```

---

### 2-4. 커스텀 훅에서 React Query 연동 표준

**쿼리 훅 (데이터 조회):**

```typescript
// ✅ DO — src/hooks/use-example-service.ts
import { useSelector } from "react-redux";
import type { StateType } from "../store/store";
import { getExamples } from "../api/example-api";
import { useQuery } from "@tanstack/react-query";

const useExampleService = () => {
  const token = useSelector((state: StateType) => state.auth.token);

  const { data: examples, isLoading, error } = useQuery({
    enabled: token !== null,              // 인증 상태 연동 — 필수
    queryKey: ["examples", token],        // token 포함 — token 변경 시 자동 refetch
    queryFn: async () => {
      const { examples } = await getExamples();
      return examples;
    },
  });

  return { examples: examples ?? [], isLoading, error }; // null 대신 빈 배열 반환
};

export default useExampleService;

// ❌ DON'T — enabled 없이 모든 상황에서 쿼리 실행
const { data } = useQuery({
  queryKey: ["examples"],
  queryFn: getExamples, // 미인증 상태에서도 요청 발생
});
```

**뮤테이션 훅 (데이터 변경):**

```typescript
// ✅ DO — src/hooks/use-example-mutation.ts
import { useMutation } from "@tanstack/react-query";
import { createExample } from "../api/example-api";

const useExampleMutation = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: { title: string; body: string }) => {
      const res = await createExample(data);
      return res;
    },
  });

  return { isPending, mutate };
};

export default useExampleMutation;
```

**훅에서 Redux 디스패치를 함께 처리하는 경우 (signIn 패턴):**

```typescript
// ✅ DO — onSuccess 안에서 dispatch 처리
const useExampleMutation = () => {
  const dispatch = useDispatch();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: { title: string }) => {
      return await createExample(data);
    },
    onSuccess: (res) => {
      dispatch(exampleActions.set({ value: res.value })); // 전역 상태 갱신
      setLocalStorage("example", res.value);              // 영속성 저장
    },
  });

  return { isPending, mutate };
};

// ❌ DON'T — 훅 내부에서 navigate 호출 (화면 전환 책임은 Screen에게)
onSuccess: () => {
  navigate("/next-page"); // 훅이 라우팅 결정권을 가지면 안 됨
}
```

화면 전환(`navigate`)은 훅의 `onSuccess` 안에 두지 않고, Screen 컴포넌트에서 `mutate(data, { onSuccess: () => navigate(...) })` 형태로 호출한다.

---

### 2-5. 로컬 스토리지 동기화 규칙

로컬 스토리지 접근은 반드시 `src/utils/local-storage.ts`의 래퍼 함수를 통해서만 한다. `localStorage.setItem()`을 직접 호출하지 않는다.

```typescript
// ✅ DO
import { setLocalStorage, getLocalStorage, removeLocalStorage } from "../utils/local-storage";

setLocalStorage("token", token);
const token = getLocalStorage<string>("token");
removeLocalStorage("token");

// ❌ DON'T — 직접 접근
localStorage.setItem("token", token);
const token = localStorage.getItem("token");
localStorage.removeItem("token");
```

**토큰 저장/삭제 타이밍 규칙:**

| 시점 | 동작 |
|------|------|
| 로그인 성공 (`onSuccess`) | `setLocalStorage("token", token)` + `dispatch(authActions.signIn({ token }))` |
| 로그아웃 완료 (`onSettled`) | `removeLocalStorage("token")` + `dispatch(authActions.signOut())` |

> 로그아웃은 `onSuccess` 대신 `onSettled`를 사용한다. API 호출이 실패하더라도 클라이언트 인증 상태를 반드시 초기화해야 하기 때문이다.

---

## 3. 코드 스타일 및 패턴 선언 (Code Style & Patterns)

### 3-1. 함수 선언 방식 — 화살표 함수 전용

컴포넌트, 커스텀 훅, 핸들러 함수 모두 **화살표 함수 형식**만 사용한다. `function` 키워드 선언은 허용하지 않는다.

```typescript
// ✅ DO
const SignInScreen = () => {
  const handleSubmit = async (e: SubmitEvent) => { ... };
  return ( ... );
};

const useSignIn = () => { ... };

// ❌ DON'T
function SignInScreen() { ... }
function useSignIn() { ... }
async function handleSubmit(e: SubmitEvent) { ... }
```

---

### 3-2. 타입 선언 — `type` 키워드 전용, `interface` 사용 금지

```typescript
// ✅ DO
type ButtonComponentProps = {
  text: string;
  type: "submit" | "reset" | "button";
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type AuthSliceStateType = {
  token: string | null;
};

// ❌ DON'T
interface ButtonComponentProps {
  text: string;
}
```

**네이밍 규칙:**

| 대상 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 Props 타입 | `{ComponentName}Props` | `ButtonComponentProps` |
| Slice 상태 타입 | `{SliceName}SliceStateType` | `AuthSliceStateType` |
| 도메인 엔티티 타입 | PascalCase 단수 | `User`, `Memo`, `Session` |
| DB 집합 타입 | PascalCase 명사 | `Database` |

---

### 3-3. 컴포넌트 선언 표준 패턴

```typescript
// ✅ DO — src/components/example-component.tsx

// 1. Props 타입 (컴포넌트 외부, 파일 최상단)
type ExampleComponentProps = {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  errorMessage: string;
  style?: React.CSSProperties;
};

// 2. 컴포넌트 함수 (화살표 함수)
const ExampleComponent = (props: ExampleComponentProps) => {
  // 3. 첫 줄에서 전체 구조 분해
  const { label, value, onChange, errorMessage, style } = props;

  return (
    <div style={{ ...style }}>
      <label>{label}</label>
      <input value={value} onChange={onChange} />
      <div style={{ color: "red" }}>{errorMessage}</div>
    </div>
  );
};

// 4. default export
export default ExampleComponent;
```

**스타일 오버라이드 패턴 — 기본값 뒤에 외부 주입:**

```typescript
// ✅ DO — 기본 스타일 뒤에 ...style 스프레드
<button
  style={{
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#3a6bfe",
    color: "#fff",
    ...style,  // 외부에서 주입된 style이 기본값을 덮어씀
  }}
>

// ❌ DON'T — 기본값 앞에 스프레드 (외부 값이 무시됨)
<button style={{ ...style, backgroundColor: "#3a6bfe" }}>
```

---

### 3-4. 데이터 처리 — 선언형 배열 고차 함수 필수

명령형 `for`/`for...of`/`while` 루프는 허용하지 않는다. 반드시 선언형 배열 메서드를 사용한다.

```typescript
// ✅ DO
const foundUser = users.find((user) => user.email === email);
const userMemos = memos.filter((memo) => memo.email === foundUser.email);
const titles = memos.map((memo) => memo.title);

// ❌ DON'T
let foundUser = null;
for (const user of users) {
  if (user.email === email) {
    foundUser = user;
    break;
  }
}

// ❌ DON'T
const titles = [];
for (let i = 0; i < memos.length; i++) {
  titles.push(memos[i].title);
}
```

**배열 불변 교체 패턴 (삭제 시):**

```typescript
// ✅ DO — filter로 불변 교체
database.sessions = database.sessions.filter(
  (session) => session.token !== token,
);

// ❌ DON'T — index 탐색 후 splice
const idx = database.sessions.findIndex((s) => s.token === token);
database.sessions.splice(idx, 1);
```

---

### 3-5. Zod 스키마 선언 위치와 사용 방법

스키마는 반드시 컴포넌트 함수 **외부** 모듈 최상단에 선언한다. 함수 내부에 선언하면 렌더링마다 재생성된다.

```typescript
// ✅ DO — 컴포넌트 함수 외부, 파일 최상단
import z from "zod";

const signInDataSchema = z.object({
  email: z.email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(4, "비밀번호는 최소 4자 이상입니다."),
});

const SignInScreen = () => {
  const [zodError, setZodError] = useState<z.ZodError | null>(null);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    // safeParse 사용 (예외를 던지지 않고 결과 객체 반환)
    const { success, data, error } = signInDataSchema.safeParse({ email, password });
    if (success === false) {
      setZodError(error);
      return; // 조기 탈출 (Early Return)
    }
    // 이후 로직은 data가 유효함이 보장된 상태
    signInMutate(data, { ... });
  };
};

// ❌ DON'T — 컴포넌트 내부에 스키마 선언
const SignInScreen = () => {
  const schema = z.object({ ... }); // 렌더링마다 재생성
};

// ❌ DON'T — parse() 사용 (예외 발생 가능)
const data = signInDataSchema.parse({ email, password }); // throw 위험
```

**에러 필드 파싱:** `src/utils/zod-error.ts`의 `parseZodError` 유틸을 반드시 사용한다.

```typescript
// ✅ DO
import { parseZodError } from "../utils/zod-error";

errorMessage={zodError === null ? "" : parseZodError(zodError, "email")}

// ❌ DON'T — 직접 파싱
errorMessage={zodError?.errors.find(e => e.path[0] === "email")?.message ?? ""}
```

---

### 3-6. 화면(Screen) 내부 코드 구조 순서

Screen 컴포넌트 내부는 항상 다음 순서로 작성한다.

```typescript
const ExampleScreen = () => {
  // 1. 전역 상태 구독 (useSelector)
  const token = useSelector((state: StateType) => state.auth.token);

  // 2. 라우터 훅
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 3. 지역 상태 (useState)
  const [value, setValue] = useState("");
  const [zodError, setZodError] = useState<z.ZodError | null>(null);

  // 4. 커스텀 훅 (비즈니스 로직 / 서버 상태)
  const { isPending, mutate } = useExampleMutation();
  const { data, isLoading } = useExampleService();

  // 5. 조건부 조기 반환 (인증 가드, 로딩 상태)
  if (token === null) return <Navigate to="/signin" replace={true} />;
  if (isLoading) return <div>잠시만 기다려주세요...</div>;

  // 6. 이벤트 핸들러 함수
  const handleSubmit = (e: SubmitEvent) => { ... };

  // 7. JSX 반환
  return ( ... );
};
```

---

### 3-7. 함수/변수 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 함수 | PascalCase + `Component` 접미사 | `ButtonComponent`, `MemoCardComponent` |
| 커스텀 훅 함수 | camelCase + `use` 접두사 | `useSignIn`, `useMemoService` |
| 이벤트 핸들러 | camelCase + `handle` 접두사 | `handleSubmit`, `handleSignOut` |
| form submit 핸들러 | camelCase + `onSubmit{FormName}` | `onSubmitSignInForm` |
| 훅에서 받은 mutate 함수 | `{동작}Mutate` 로 별칭 | `const { mutate: signInMutate } = useSignIn()` |
| 훅에서 받은 data | `data: {도메인명}` 으로 별칭 | `const { data: me } = useMe()` |

---

## 4. 예외 처리 및 방어적 코딩 (Error Handling & Defense)

### 4-1. API 레이어 에러 변환 — 2단계 변환 패턴 의무화

모든 API 함수는 `isAxiosError` 체크 후 반드시 `ApiError`로 변환한다. 변환 없이 AxiosError를 상위로 전파하지 않는다.

```typescript
// ✅ DO — 2단계 변환 (HTTP 에러 → 비즈니스 에러)
export const createExample = async (data: { title: string }) => {
  try {
    const res = await client.post("/examples", data);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      // 1단계: AxiosError → ApiError (errorCode 추출)
      throw new ApiError(err.response?.data.errorCode);
    }
    // 2단계: 예상치 못한 에러는 그대로 전파 (삼켜서 숨기지 않음)
    throw err;
  }
};

// ❌ DON'T — try-catch 없음 (에러 출처 불명)
export const createExample = async (data: { title: string }) => {
  const res = await client.post("/examples", data);
  return res.data;
};

// ❌ DON'T — 에러를 삼켜서 숨김 (undefined 반환 → 호출자가 에러를 모름)
export const createExample = async (data: { title: string }) => {
  try {
    const res = await client.post("/examples", data);
    return res.data;
  } catch (err) {
    console.error(err); // 로깅만 하고 throw 없음 → 상위에 에러 전파 안 됨
  }
};
```

---

### 4-2. Screen에서 에러 분기 처리

화면에서 `onError` 콜백을 사용할 때는 `errorCode` 기반으로 분기하고, 기타 케이스에 대한 fallback 메시지를 반드시 포함한다.

```typescript
// ✅ DO
mutate(data, {
  onSuccess: () => {
    navigate("/memo");
  },
  onError: (err: ApiError) => {
    dispatch(
      toastActions.set({
        message:
          err.errorCode === "INVALID_AUTH"
            ? "이메일 또는 비밀번호가 잘못되었어요"
            : "알 수 없는 에러가 발생했어요", // fallback 필수
        code: err.errorCode === "INVALID_AUTH" ? 101 : 500,
      }),
    );
  },
});

// ❌ DON'T — onError 없음 (에러 발생 시 사용자에게 아무 피드백 없음)
mutate(data, {
  onSuccess: () => navigate("/memo"),
});

// ❌ DON'T — fallback 없음
onError: (err: ApiError) => {
  if (err.errorCode === "INVALID_AUTH") {
    // INVALID_AUTH 외 다른 에러는 무음 처리됨
    dispatch(toastActions.set({ message: "인증 실패", code: 101 }));
  }
}
```

---

### 4-3. `useEffect` 타이머 — 반드시 cleanup 함수에서 해제

`setTimeout` / `setInterval`을 `useEffect` 안에서 사용할 때는 반드시 cleanup 함수에서 해제한다. 해제하지 않으면 컴포넌트 언마운트 후에도 타이머가 실행되어 메모리 누수 및 상태 갱신 에러가 발생한다.

```typescript
// ✅ DO
useEffect(() => {
  if (message === null) return; // 조기 탈출 — 불필요한 타이머 등록 방지

  const timer = setTimeout(() => {
    dispatch(toastActions.clear());
  }, 3000);

  return () => {
    clearTimeout(timer); // 언마운트 또는 의존성 재실행 시 반드시 해제
  };
}, [message, dispatch]);

// ❌ DON'T — cleanup 없음
useEffect(() => {
  setTimeout(() => {
    dispatch(toastActions.clear());
  }, 3000);
  // cleanup 없음 → 메모리 누수, StrictMode에서 이중 실행 문제
}, [message]);
```

---

### 4-4. 조건부 조기 탈출 (Early Return) 패턴 — 중첩 if 금지

인증 가드, 로딩 상태, 유효성 실패 시 중첩 `if` 블록 대신 조기 탈출을 사용한다.

```typescript
// ✅ DO — Early Return 패턴
const ExampleScreen = () => {
  const token = useSelector((state: StateType) => state.auth.token);
  const { data, isLoading } = useExampleService();

  if (token === null) return <Navigate to="/signin" replace={true} />;
  if (isLoading || data === undefined) return <div>잠시만 기다려주세요...</div>;

  // 이후 코드는 token과 data가 유효함이 보장됨
  return <div>{data.title}</div>;
};

// ❌ DON'T — 중첩 if
const ExampleScreen = () => {
  const token = useSelector((state: StateType) => state.auth.token);
  if (token !== null) {
    // 중첩 depth 증가, 가독성 저하
    return <div>...</div>;
  } else {
    return <Navigate to="/signin" replace={true} />;
  }
};
```

---

### 4-5. `onSettled` vs `onSuccess` 선택 기준

로그아웃처럼 **API 성공/실패 여부와 무관하게 클라이언트 상태를 반드시 초기화해야 하는 경우**에는 `onSuccess` 대신 `onSettled`를 사용한다.

```typescript
// ✅ DO — 로그아웃: API 실패해도 로컬 상태 초기화 보장
const { mutate } = useMutation({
  mutationFn: async () => signOutRequest(),
  onSettled: () => {                      // 성공/실패 모두 실행
    dispatch(authActions.signOut());
    removeLocalStorage("token");
  },
});

// ❌ DON'T — 로그아웃에 onSuccess 사용 (API 실패 시 토큰이 로컬에 남음)
const { mutate } = useMutation({
  mutationFn: async () => signOutRequest(),
  onSuccess: () => {                      // API 실패 시 실행 안 됨
    dispatch(authActions.signOut());
    removeLocalStorage("token");
  },
});
```

---

### 4-6. MSW 핸들러 작성 규칙 (개발 환경 목 서버)

새 API 엔드포인트를 추가할 때는 `src/server/handlers.ts`에 핸들러를 추가하고, 타입은 `src/server/database.ts`에서 정의한다.

```typescript
// ✅ DO — handlers.ts 핸들러 추가 패턴
http.post("/api/examples", async ({ request }) => {
  await delay(500); // 실제 네트워크 지연 시뮬레이션 — 항상 포함

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  // 인증 검증 — 인증이 필요한 모든 핸들러에서 필수
  const foundSession = loadedDatabase.sessions.find(
    (session) => session.token === token,
  );
  if (foundSession == null) {
    return HttpResponse.json({ errorCode: "INVALID_TOKEN" }, { status: 401 });
  }

  const body = await request.json();
  const { title } = body as { title: string };

  // 상태 변경 후 localStorage에 영속화
  loadedDatabase.examples.push({ ... });
  setLocalStorage("database", loadedDatabase);

  return HttpResponse.json({ example: newExample }, { status: 201 });
}),

// ❌ DON'T — delay 없음 (즉시 응답 → 실제 환경과 동작 차이 발생)
http.post("/api/examples", async ({ request }) => {
  // await delay(500) 누락
  return HttpResponse.json({ example: {} }, { status: 201 });
}),
```

---

## 5. classnames 라이브러리와 CSS 모듈을 사용

컴포넌트 스타일을 컴포넌트 외부에서 설정하고 하고 싶은 경우, classnames 라이브러리와 CSS 모듈을 사용한다.

### 5-1. classnames 라이브러리와 CSS 모듈을 사용한 예

```
import styles from './Button.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

function Button({ isPending, color, size, invert, children }) {
  return (
    <button
      className={cx(
        'button',
        isPending && 'pending',
        color,
        size,
        invert && 'invert',
      )}
    >
      {children}
    </button>
  );
}

export default Button;
```

다음에, 예시처럼 사용하면 되는데요.

1. `import classnames from 'classnames/bind'` import 추가
2. `classnames.bind(styles)`로 `styles` 객체와 bind 해주기 ('묶어주기')
3. Bind한 결과(`cx`)로 클래스 이름들 전달하기




---

## 부록: 신규 기능 추가 체크리스트

기능 개발 완료 후 아래 항목을 전부 통과해야 한다.

```
[ ] 파일명이 kebab-case인가?
[ ] JSX 포함 여부에 따라 .ts / .tsx가 올바르게 선택되었는가?
[ ] 타입 전용 import에 import type이 붙어 있는가?
[ ] type 키워드만 사용했는가? (interface 없음)
[ ] Props 타입명이 {ComponentName}Props 패턴인가?
[ ] 컴포넌트 첫 줄에서 const { ... } = props 구조 분해를 했는가?
[ ] function 키워드 없이 화살표 함수만 사용했는가?
[ ] Zod 스키마가 컴포넌트 함수 외부에 선언되어 있는가?
[ ] safeParse를 사용했는가? (parse 대신)
[ ] 배열 처리에 map/filter/find 등 선언형 메서드만 사용했는가? (for 루프 없음)
[ ] API 함수에 try-catch + isAxiosError + ApiError 변환이 있는가?
[ ] onError 콜백에 fallback 메시지가 있는가?
[ ] useEffect 안의 setTimeout에 cleanup clearTimeout이 있는가?
[ ] 인증이 필요한 useQuery에 enabled: token !== null 조건이 있는가?
[ ] queryKey에 token이 포함되어 있는가?
[ ] 로그아웃처럼 반드시 실행해야 하는 정리 로직에 onSettled를 사용했는가?
[ ] 로컬 스토리지 접근에 래퍼 함수(setLocalStorage 등)를 사용했는가?
[ ] actions는 named export, reducer는 default export로 분리되어 있는가?
[ ] MSW 핸들러에 await delay(500)이 포함되어 있는가?
[ ] 화면 전환(navigate)은 Screen 레벨에서 처리하는가? (훅 내부 아님)
[ ] Screen 내부 코드 순서가 [전역상태 → 라우터훅 → 지역상태 → 커스텀훅 → 조기반환 → 핸들러 → JSX] 인가?
```
