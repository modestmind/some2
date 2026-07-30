import { useDispatch } from "react-redux";
import { tokenActions } from "../shared/store/auth-slice";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/login-api";

const useLogin = () => {
  const dispatch = useDispatch();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: {
      sns_provider_code: string;
      credential: string;
    }) => {
      return await loginRequest(data);
    },
    onSuccess: (res) => {
      // 액세스 토큰은 메모리(Redux)에만 저장, 리프레시 토큰은 httpOnly 쿠키로 자동 관리
      dispatch(tokenActions.set({ token: res.token, nickname: res.nickname }));
    },
  });

  return { isPending, mutate };
};

export default useLogin;
