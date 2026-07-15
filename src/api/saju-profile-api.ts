import { isAxiosError } from "axios";
import z from "zod";
import client, { ApiError } from "./client";

export type SaveMyInfoRequestData = {
  name: string;
  gender: "F" | "M";
  birth_date: string;
  calendar_type: "solar" | "lunar" | "lunar_leap";
  birth_time: string;
};

const sajuProfileResponseSchema = z.object({
  saju_profile: z.object({
    saju_profile_id: z.coerce.number(),
  }),
});

export const saveMyInfoRequest = async (data: SaveMyInfoRequestData) => {
  try {
    const res = await client.post("/saju/profile", {
      ...data,
      is_self: "Y",
      relationship_type: "",
      relation_duration: "",
      relationship_status: "",
    });

    const parsed = sajuProfileResponseSchema.safeParse(res.data);
    if (parsed.success === false) throw parsed.error;

    return parsed.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};

export type SaveOtherInfoRequestData = {
  name: string;
  gender: "F" | "M";
  birth_date: string;
  calendar_type: "solar" | "lunar" | "lunar_leap";
  birth_time: string;
  relationship_type: string;
  relation_duration: string;
  relationship_status: string;
};

export const saveOtherInfoRequest = async (data: SaveOtherInfoRequestData) => {
  try {
    const res = await client.post("/saju/profile", {
      ...data,
      is_self: "N",
    });

    const parsed = sajuProfileResponseSchema.safeParse(res.data);
    if (parsed.success === false) throw parsed.error;

    return parsed.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};

export type MyProfileResponse = {
  saju_profile?: {
    name: string;
    gender: "F" | "M";
    birth_date: string;
    calendar_type: "solar" | "lunar" | "lunar_leap";
    birth_time: string | null;
  };
};

export const getMyProfileRequest = async (): Promise<MyProfileResponse> => {
  try {
    const res = await client.get("/saju/my-profile");
    
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};
