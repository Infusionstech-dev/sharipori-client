import { createSlice } from "@reduxjs/toolkit";

// Shared because both the header and the bottom nav open the mobile menu.
const uiSlice = createSlice({
  name: "ui",
  initialState: { mobileMenuOpen: false },
  reducers: {
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
