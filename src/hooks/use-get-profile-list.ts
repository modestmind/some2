import { useQuery } from "@tanstack/react-query";
import { getProfileListRequest } from "../api/saju-profile-api";

const useGetProfileList = () => {
  return useQuery({
    queryKey: ["profile-list"],
    queryFn: getProfileListRequest,
  });
};

export default useGetProfileList;
