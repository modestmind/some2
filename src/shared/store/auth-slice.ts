import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TokenSliceStateType = {
  token: string | null;
  nickname: string | null;
};

const initialState: TokenSliceStateType = {
  token: null,
  nickname: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ token: string; nickname: string }>) => {
      state.token = action.payload.token;
      state.nickname = action.payload.nickname;
    },
    clear: (state) => {
      state.token = null;
      state.nickname = null;
    },
  },
});

export const tokenActions = authSlice.actions;
export default authSlice.reducer;
