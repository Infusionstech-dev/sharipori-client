import { createSlice } from "@reduxjs/toolkit";

export const WISHLIST_STORAGE_KEY = "ss_wishlist";
export const MAX_WISHLIST = 50;

// Product ids the customer saved, newest first. It lives in the browser, like the guest cart, so
// it works without an account. hydrated stays false until localStorage has been read, so nothing
// overwrites a saved list early.
const initialState = { ids: [], hydrated: false };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggle: (state, action) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((saved) => saved !== id);
      } else {
        state.ids = [id, ...state.ids].slice(0, MAX_WISHLIST);
      }
    },
    remove: (state, action) => {
      state.ids = state.ids.filter((saved) => saved !== action.payload);
    },
    clear: (state) => {
      state.ids = [];
    },
    replaceAll: (state, action) => {
      state.ids = action.payload;
      state.hydrated = true;
    },
  },
});

export const { toggle, remove, clear, replaceAll } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Storage can be missing, blocked or edited by hand, so anything odd is treated as empty.
export function loadSavedWishlist() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY));
    return Array.isArray(saved)
      ? [...new Set(saved.filter((id) => Number.isInteger(id) && id > 0))].slice(0, MAX_WISHLIST)
      : [];
  } catch {
    return [];
  }
}

export function saveWishlist(ids) {
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // The wishlist still works for this visit.
  }
}
