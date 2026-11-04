import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  status: "idle", // idle | checking | authenticated | unauthenticated | unavailable
  signedOutByUser: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionCheckStarted: (state) => {
      state.status = "checking";
    },
    // The session could not be checked (rate limit or network), which does not mean it ended.
    sessionUnavailable: (state) => {
      state.status = "unavailable";
    },
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.accessToken = accessToken;
      if (user !== undefined) {
        state.user = user;
      }
      state.status = "authenticated";
      state.signedOutByUser = false;
    },
    logout: (state, action) => {
      state.signedOutByUser = action.payload?.byUser === true;
      state.user = null;
      state.accessToken = null;
      state.status = "unauthenticated";
    },
  },
});

export const { sessionCheckStarted, sessionUnavailable, setCredentials, logout } =
  authSlice.actions;
export default authSlice.reducer;
