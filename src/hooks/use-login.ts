import { useDispatch } from "react-redux";
import { tokenActions } from "../store/auth-slice";
import { useMutation } from "@tanstack/react-query";
import { setLocalStorage } from "../utils/local-storage";
import { loginRequest } from "../api/login-api";
import { parseTokenExpiry, scheduleSilentRefresh } from "../utils/token-util";

const useLogin = () => {
  const dispatch = useDispatch();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: {
          sns_provider_code: string;
          sns_user_key: string;
          nickname: string;
        }) => {
      const res = await loginRequest(data);
      return res;
    },
    onSuccess: (res, variables) => {
      const { token, nickname } = res;
      const { sns_provider_code, sns_user_key } = variables;

      dispatch(tokenActions.set({ token, nickname }));
      setLocalStorage("token", token);
      setLocalStorage("nickname", nickname);

      const expiresAt = parseTokenExpiry(token);
      setLocalStorage("token_expires_at", expiresAt);
      setLocalStorage("sns_provider_code", sns_provider_code);
      setLocalStorage("sns_user_key", sns_user_key);

      scheduleSilentRefresh(expiresAt);
    },
  });

  return { isPending, mutate };
};

export default useLogin;
