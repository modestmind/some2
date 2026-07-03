import { useQuery } from "@tanstack/react-query";
import { getMyProfileRequest } from "../api/saju-profile-api";

const useGetMyProfile = () => {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfileRequest,
  });
};

export default useGetMyProfile;
