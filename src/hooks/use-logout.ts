import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { tokenActions } from "../shared/store/auth-slice";
import { logoutRequest } from "../api/logout-api";

const useLogout = () => {
  const dispatch = useDispatch();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await logoutRequest();
    },
    onSettled: () => {
      // API 성공/실패 무관하게 클라이언트 인증 상태 초기화
      dispatch(tokenActions.clear());
    },
  });

  return { isPending, mutate };
};

export default useLogout;
