import axios from "axios";
import { isAxiosError } from "axios";
import z from "zod";
import client, { ApiError } from "./client";
import { AXIOS_CONFIG } from "../shared/config";

const refreshResSchema = z.object({
  token: z.string(),
  nickname: z.string(),
});

// 앱 초기 로드 시 토큰 복구용 — 인터셉터 없는 axios 사용 (무한 루프 방지)
export const initRefreshRequest = async () => {
  const res = await axios.post(
    `${AXIOS_CONFIG.baseURL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  const parsed = refreshResSchema.safeParse(res.data);
  if (parsed.success === false) throw parsed.error;
  return parsed.data;
};

// 인터셉터 내 토큰 갱신용
export const refreshRequest = async () => {
  try {
    const res = await client.post("/auth/refresh");
    const parsed = refreshResSchema.safeParse(res.data);
    if (parsed.success === false) throw parsed.error;
    return parsed.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};
