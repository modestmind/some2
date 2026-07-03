import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ToastSliceStateType = {
  message: string | null;
  code: number;
};
const initialState: ToastSliceStateType = {
  message: null,
  code: -1,
};
const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    show: (state, action: PayloadAction<{ message: string; code: number }>) => {
      state.message = action.payload.message;
      state.code = action.payload.code;
    },
    hide: (state) => {
      state.message = null;
      state.code = -1;
    },
  },
});

export const toastActions = toastSlice.actions;
export default toastSlice.reducer;
