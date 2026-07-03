import { isAxiosError } from "axios";
import z from "zod";
import client, { ApiError } from "./client";

export const loginRequest = async (data: {
  sns_provider_code: string;
  sns_user_key: string;
  nickname: string;
}) => {
  try {
    const res = await client.post("/login", data);

    const resDataSchema = z.object({
      token: z.string(),
      nickname: z.string(),
    });

    const parsed = resDataSchema.safeParse(res.data);
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
