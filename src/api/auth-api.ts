import client from "./client";

export const verifyTokenRequest = async () => {
  await client.get("/auth/verify");
};
