import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import store, { type StateType } from "../shared/store/store";
import { tokenActions } from "../shared/store/auth-slice";
import { toastActions } from "../shared/store/toast-slice";
import { refreshRequest } from "./auth-api";
import { AXIOS_CONFIG } from "../shared/config";

const client = axios.create(AXIOS_CONFIG);

client.interceptors.request.use((config) => {
  const auth = (store.getState() as StateType).auth;
  if (auth.token !== null) {
    config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  }
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const handleAuthFailure = () => {
  store.dispatch(toastActions.show({ message: "세션이 만료되었습니다. 다시 로그인해주세요.", code: 401 }));
  store.dispatch(tokenActions.clear());
  window.location.replace("/login");
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig;

    if (error.response?.status === 401) {
      // refresh 요청 자체가 401 → 무한 루프 방지, 즉시 로그아웃
      if (originalRequest.url?.includes("/auth/refresh")) {
        handleAuthFailure();
        return Promise.reject(error);
      }

      // 첫 번째 401 → refresh 시도 후 원래 요청 재시도
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { token, nickname } = await refreshRequest();
          store.dispatch(tokenActions.set({ token, nickname }));
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        } catch {
          handleAuthFailure();
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export class ApiError extends Error {}

export default client;
