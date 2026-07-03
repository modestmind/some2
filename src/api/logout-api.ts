import { isAxiosError } from "axios";
import client, { ApiError } from "./client";

export const logoutRequest = async () => {
  try {
    const res = await client.post("/logout");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data.errorCode);
    }
    throw err;
  }
};
