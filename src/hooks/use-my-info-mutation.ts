import { useMutation } from "@tanstack/react-query";
import { saveMyInfoRequest } from "../api/saju-profile-api";
import type { SaveMyInfoRequestData } from "../api/saju-profile-api";

const useMyInfoMutation = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: SaveMyInfoRequestData) => {
      return await saveMyInfoRequest(data);
    },
  });

  return { isPending, mutate };
};

export default useMyInfoMutation;
