import { isAxiosError } from "axios";
import client, { ApiError } from "./client";

export type CreateOrderRequestData = {
  saju_profile_id: number;
  payment_amount: number;
};

export type CreateOrderResponse = {
  order_id: string;
};

export const createOrderRequest = async (data: CreateOrderRequestData): Promise<CreateOrderResponse> => {
  try {
    const res = await client.post("/orders/create", data);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};

export type ConfirmOrderRequestData = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

export type ConfirmOrderResponse = {
  order_id: string;
  report_id: string;
};

export const confirmOrderRequest = async (data: ConfirmOrderRequestData): Promise<ConfirmOrderResponse> => {
  try {
    const res = await client.post("/orders/confirm", data);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) throw new ApiError(err.response?.data.message);
    throw err;
  }
};
