import axios from "axios";
import store from "../store/store";

const client = axios.create({
  baseURL: "/api",
});

client.interceptors.request.use((config) => {
  if (store.getState().auth.token !== null) {
    config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
  }
  return config;
});

export class ApiError extends Error {
  errorCode: string;

  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
  }
}

export default client;
