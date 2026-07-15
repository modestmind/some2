import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { tokenActions } from "../store/auth-slice";
import { logoutRequest } from "../api/logout-api";
import { removeLocalStorage } from "../utils/local-storage";
import { cancelSilentRefresh } from "../utils/token-util";

const useLogout = () => {
  const dispatch = useDispatch();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await logoutRequest();
    },
    onSettled: () => {
      cancelSilentRefresh();
      dispatch(tokenActions.clear());
      removeLocalStorage("token");
      removeLocalStorage("nickname");
      removeLocalStorage("token_expires_at");
      removeLocalStorage("sns_provider_code");
      removeLocalStorage("sns_user_key");
    },
  });

  return { isPending, mutate };
};

export default useLogout;
