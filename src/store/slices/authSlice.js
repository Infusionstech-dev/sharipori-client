import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  status: "idle", // idle | authenticated | unauthenticated
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.accessToken = accessToken;
      if (user !== undefined) {
        state.user = user;
      }
      state.status = "authenticated";
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
