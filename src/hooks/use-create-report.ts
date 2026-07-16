import { useMutation } from "@tanstack/react-query";
import { createReportRequest } from "../api/saju-profile-api";

const useCreateReport = () => {
  return useMutation({
    mutationFn: createReportRequest,
  });
};

export default useCreateReport;
