import { useMutation } from "@tanstack/react-query";
import { createOrderRequest } from "../api/order-api";

const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrderRequest,
  });
};

export default useCreateOrder;
