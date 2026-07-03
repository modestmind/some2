import { configureStore } from "@reduxjs/toolkit";
import tokenSlice from "./token-slice";
import toastSlice from "./toast-slice";

const store = configureStore({
  reducer: {
    token: tokenSlice,
    toast: toastSlice,
  },
});

export type StateType = ReturnType<typeof store.getState>;
export default store;
