import { isAxiosError } from "axios";
import client, { ApiError } from "./client";

export type ReportData = {
  report_id: string;
  report_status: string;
  report_section1: string | null;
  report_section2: string | null;
  report_section3: string | null;
  report_section4: string | null;
  report_section5: string | null;
  report_section6: string | null;
  report_section7: string | null;
  report_section8: string | null;
  created_at: string;
  client_name: string | null;
  partner_name: string | null;
  partner_relationship_type: string | null;
};

export type ReportListItem = {
  report_id: string;
  saju_profile_id: number;
  report_status: string;
  created_at: string;
  partner_name: string;
  partner_gender: string;
  partner_relationship_type: string | null;
};

export const getMyReportsRequest = async (): Promise<{ reports: ReportListItem[] }> => {
  try {
    const res = await client.get("/reports");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};

export const generateReportRequest = async (reportId: string): Promise<{ report_id: string }> => {
  try {
    const res = await client.post("/reports/generate", { report_id: reportId });
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};

export const getReportRequest = async (reportId: string): Promise<{ report: ReportData }> => {
  try {
    const res = await client.get(`/reports/${reportId}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};
