import { useMutation } from "@tanstack/react-query";
import { saveOtherInfoRequest } from "../api/saju-profile-api";
import type { SaveOtherInfoRequestData } from "../api/saju-profile-api";

const useSaveOtherProfile = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: SaveOtherInfoRequestData) => {
      return await saveOtherInfoRequest(data);
    },
  });

  return { isPending, mutate };
};

export default useSaveOtherProfile;
