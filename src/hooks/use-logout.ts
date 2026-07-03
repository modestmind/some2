import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { tokenActions } from "../store/token-slice";
import { logoutRequest } from "../api/logout-api";
import { removeLocalStorage } from "../utils/local-storage";

const useLogout = () => {
  const dispatch = useDispatch();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await logoutRequest();
    },
    onSettled: () => {
      dispatch(tokenActions.clear());
      removeLocalStorage("token");
    },
  });

  return { isPending, mutate };
};

export default useLogout;
