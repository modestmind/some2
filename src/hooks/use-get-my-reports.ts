import { useQuery } from "@tanstack/react-query";
import { getMyReportsRequest } from "../api/report-api";

export const useGetMyReports = () =>
  useQuery({
    queryKey: ["my-reports"],
    queryFn: getMyReportsRequest,
  });
