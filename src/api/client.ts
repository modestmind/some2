import axios from "axios";
import store, { type StateType } from "../store/store";
import { tokenActions } from "../store/auth-slice";
import { removeLocalStorage } from "../utils/local-storage";

const client = axios.create({
  //baseURL: "/api",  // 내부 목서버
  //baseURL: "http://localhost:3000/api",  // 로컬 서버
  baseURL: "https://some2-backend.onrender.com/api",  // render 서버
});

client.interceptors.request.use((config) => {
  const auth = (store.getState() as StateType).auth;
  if (auth.token !== null) {
    config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeLocalStorage("token");
      removeLocalStorage("nickname");
      removeLocalStorage("token_expires_at");
      removeLocalStorage("sns_provider_code");
      removeLocalStorage("sns_user_key");
      store.dispatch(tokenActions.clear());
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error { }

export default client;
