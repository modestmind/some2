import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorage } from "../utils/local-storage";

type TokenSliceStateType = {
  token: string | null;
};
const initialState: TokenSliceStateType = {
  token: getLocalStorage("token"),
};
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    clear: (state) => {
      state.token = null;
    },
  },
});

export const tokenActions = tokenSlice.actions;
export default tokenSlice.reducer;
