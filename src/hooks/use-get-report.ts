import { useQuery } from "@tanstack/react-query";
import { getReportRequest } from "../api/report-api";

export const useGetReport = (reportId: string) =>
  useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportRequest(reportId),
    enabled: !!reportId,
  });
