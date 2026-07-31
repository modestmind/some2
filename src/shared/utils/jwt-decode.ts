export const decodeJwtPayload = (token: string): Record<string, unknown> => {
  const base64 = token.split(".")[1];
  return JSON.parse(atob(base64));
};
