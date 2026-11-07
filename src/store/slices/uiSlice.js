import { createSlice } from "@reduxjs/toolkit";

// Shared because both the header and the bottom nav open the mobile menu,
// and any Add to cart button opens the cart drawer.
const uiSlice = createSlice({
  name: "ui",
  initialState: { mobileMenuOpen: false, cartDrawerOpen: false },
  reducers: {
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    setCartDrawerOpen: (state, action) => {
      state.cartDrawerOpen = action.payload;
    },
  },
});

export const { setMobileMenuOpen, setCartDrawerOpen } = uiSlice.actions;
export default uiSlice.reducer;
