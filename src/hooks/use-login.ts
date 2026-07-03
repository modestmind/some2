import { useDispatch } from "react-redux";
import { tokenActions } from "../store/auth-slice";
import { useMutation } from "@tanstack/react-query";
import { setLocalStorage } from "../utils/local-storage";
import { loginRequest } from "../api/login-api";

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
    onSuccess: (res) => {
      const { token, nickname } = res;
      dispatch(tokenActions.set({ token, nickname }));
      setLocalStorage("token", token);
      setLocalStorage("nickname", nickname);
    },
  });

  return { isPending, mutate };
};

export default useLogin;
