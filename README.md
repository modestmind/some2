# 연애판별소 (연판소) — 프론트엔드

> 사주 기반 썸 관계 분석 리포트 서비스

## 프로젝트 소개

**연판소**는 썸 단계에서 관계의 불확실성으로 고민하는 사용자를 위한 서비스입니다.  
나와 상대방의 사주(생년월일/시)를 입력하면, AI가 두 사람의 관계를 분석한 **썸 손절 판별 리포트**를 제공합니다.

| 문제 | 해결 |
|------|------|
| 상대가 나를 좋아하는지 모르겠다 | 상대의 연애 성향 분석 |
| 계속 가도 되는 관계인지 모르겠다 | 관계 흐름 및 발전 가능성 평가 |
| 손절 타이밍을 모르겠다 | 위험 신호 감지 + 행동 가이드 제공 |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router DOM 7 |
| 상태관리 | Redux Toolkit 2 + TanStack React Query 5 |
| HTTP | Axios 1.18 |
| 결제 | Toss Payments SDK 2.7 |
| 유효성 검사 | Zod 4 |
| 스타일 | CSS Modules + classnames |
| 날짜 | dayjs |
| API Mocking | MSW 2 |
| 코드 품질 | ESLint 10, Prettier 3 |

---

## 주요 기능 흐름

```
랜딩 페이지
  → 카카오 / 구글 소셜 로그인
  → 내 생년월일·시 입력
  → 상대방 프로필 입력 (관계 유형 포함)
  → 결제 (3,300원 / 토스페이먼츠)
  → 리포트 생성 대기 (AI 분석)
  → 8섹션 분석 리포트 확인
  → 내 리포트 목록 관리
```

**인증 전략**
- Access Token: Redux 메모리 저장 (새로고침 시 쿠키로 자동 재발급)
- Refresh Token: httpOnly 쿠키
- Axios 인터셉터로 401 응답 시 토큰 자동 갱신

---

## 화면 (라우트) 목록

| 경로 | 화면 | 설명 |
|------|------|------|
| `/` | MainScreen | 마케팅 랜딩 페이지 |
| `/login` | LoginScreen | 카카오·구글 소셜 로그인 |
| `/my-profile` | MyProfileScreen | 내 생년월일/시 입력 |
| `/other-profile` | OtherProfileScreen | 상대방 프로필 + 관계 유형 선택 |
| `/payment` | PaymentScreen | 토스페이먼츠 결제 (3,300원) |
| `/payment/success` | PaymentSuccessScreen | 결제 완료 처리 |
| `/payment/fail` | PaymentFailScreen | 결제 실패 처리 |
| `/report-creating` | ReportCreatingScreen | 리포트 생성 대기 (AI 분석 중) |
| `/report` | ReportScreen | 8섹션 분석 리포트 |
| `/report-list` | ReportListScreen | 내 리포트 목록 |
| `/auth/kakao/callback` | KakaoCallbackScreen | 카카오 OAuth 콜백 처리 |

---

## 프로젝트 구조

```
src/
├── api/           # Axios 기반 API 모듈 (auth, saju, order, report)
├── components/    # 재사용 UI 컴포넌트 (버튼, 인풋, 리포트 카드 등 19개)
├── hooks/         # React Query·Mutation 커스텀 훅 (11개)
├── screens/       # 페이지 컴포넌트 + 각 화면별 CSS Modules
├── server/msw/    # Mock Service Worker (개발용 API 목킹)
├── shared/
│   ├── config.ts  # 환경변수 및 Axios 기본 설정
│   ├── store/     # Redux 스토어 (auth 슬라이스, toast 슬라이스)
│   ├── types/     # 외부 SDK 타입 선언 (Kakao, Google)
│   └── utils/     # 공통 유틸리티 (날짜, JWT, Zod 에러 등)
├── router.tsx     # React Router 라우트 정의
└── main.tsx       # 앱 진입점 (Redux Provider, QueryClient 등록)
```

---

## 개발 환경 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_IS_PRODUCTION=N
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
VITE_KAKAO_JS_APP_KEY=your_kakao_js_app_key
VITE_TOSS_CLIENT_KEY=your_toss_client_key
```

| 변수 | 설명 |
|------|------|
| `VITE_IS_PRODUCTION` | `Y` 이면 프로덕션 API 서버 사용, `N` 이면 로컬 서버(`localhost:3000`) |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Google Cloud Console에서 발급한 OAuth 2.0 클라이언트 ID |
| `VITE_KAKAO_JS_APP_KEY` | Kakao Developers에서 발급한 JavaScript 앱 키 |
| `VITE_TOSS_CLIENT_KEY` | Toss Payments 테스트/프로덕션 클라이언트 키 |

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# ESLint 검사
npm run lint

# Prettier 포맷팅
npm run format
```

---

## 배포

| 구분 | URL |
|------|-----|
| 프론트엔드 (Vercel) | https://some2.vercel.app |
| 백엔드 API (Render) | https://some2-backend.onrender.com/api |
