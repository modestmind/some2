import store from "../store/store";
import { tokenActions } from "../store/auth-slice";
import { loginRequest } from "../api/login-api";
import { setLocalStorage, getLocalStorage, removeLocalStorage } from "./local-storage";

let silentRefreshTimer: ReturnType<typeof setTimeout> | null = null;

// JWT payload의 exp 필드 파싱. 비-JWT 토큰(개발용 UUID 등)은 1시간 fallback.
export function parseTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch {
    return Date.now() + 60 * 60 * 1000;
  }
}

export function cancelSilentRefresh() {
  if (silentRefreshTimer) {
    clearTimeout(silentRefreshTimer);
    silentRefreshTimer = null;
  }
}

export function scheduleSilentRefresh(expiresAt: number) {
  cancelSilentRefresh();

  const delay = expiresAt - Date.now() - 5 * 60 * 1000;

  if (delay <= 0) {
    silentRefresh();
    return;
  }

  silentRefreshTimer = setTimeout(() => {
    silentRefresh();
  }, delay);
}

async function silentRefresh() {
  const snsProviderCode = getLocalStorage<string>("sns_provider_code");
  const snsUserKey = getLocalStorage<string>("sns_user_key");
  const nickname = getLocalStorage<string>("nickname");

  if (!snsProviderCode || !snsUserKey || !nickname) {
    handleAuthFailure();
    return;
  }

  try {
    const res = await loginRequest({
      sns_provider_code: snsProviderCode,
      sns_user_key: snsUserKey,
      nickname,
    });

    const expiresAt = parseTokenExpiry(res.token);
    setLocalStorage("token", res.token);
    setLocalStorage("nickname", res.nickname);
    setLocalStorage("token_expires_at", expiresAt);
    store.dispatch(tokenActions.set({ token: res.token, nickname: res.nickname }));

    scheduleSilentRefresh(expiresAt);
  } catch {
    handleAuthFailure();
  }
}

function handleAuthFailure() {
  cancelSilentRefresh();
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
