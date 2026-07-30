// 실 운영 여부
const isProduction = import.meta.env.VITE_IS_PRODUCTION === "Y";

// AXIOS 설정 - client.ts
export const AXIOS_CONFIG = {
  baseURL: isProduction ? "https://some2-backend.onrender.com/api" : "http://localhost:3000/api",  // 내부 목서버 : "/api"
  withCredentials: true,
} as const;

// Google OAuth 클라이언트 ID
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string;

// Kakao JavaScript 앱 키
export const KAKAO_JS_APP_KEY = import.meta.env.VITE_KAKAO_JS_APP_KEY as string;

// Kakao 로그인 콜백 URI
export const KAKAO_REDIRECT_URI = isProduction ? "https://some2.vercel.app/auth/kakao/callback" : "http://localhost:5173/auth/kakao/callback";
