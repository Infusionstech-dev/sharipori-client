import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { itemCount: 0 },
  reducers: {
    // Placeholder so product pages have something to call. T6.1 adds the real cart.
    addToCartRequested: () => {},
    setItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
  },
});

export const { addToCartRequested, setItemCount } = cartSlice.actions;
export default cartSlice.reducer;
