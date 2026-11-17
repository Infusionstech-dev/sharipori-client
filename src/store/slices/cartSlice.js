import { createSlice } from "@reduxjs/toolkit";

export const CART_STORAGE_KEY = "ss_cart";
export const MAX_LINE_QTY = 10;

// The guest cart. Logged-in customers use the server cart instead (cartApi).
// items: [{ variantId, quantity, snapshot: { name, image, price, size, color, slug, availableQty } }]
// hydrated stays false until localStorage has been read, so nothing overwrites a saved cart early.
// mergeFailed is set when moving the guest items into the customer's cart after login kept
// failing, so pages stop waiting for it.
const initialState = { items: [], hydrated: false, mergeFailed: false };

const maxFor = (item) =>
  Math.max(1, Math.min(item.snapshot?.availableQty ?? MAX_LINE_QTY, MAX_LINE_QTY));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state, action) => {
      const { variantId, quantity, snapshot } = action.payload;
      const existing = state.items.find((item) => item.variantId === variantId);
      if (existing) {
        existing.snapshot = snapshot;
        existing.quantity = Math.min(existing.quantity + quantity, maxFor(existing));
      } else {
        const item = { variantId, quantity: 0, snapshot };
        item.quantity = Math.min(quantity, maxFor(item));
        state.items.push(item);
      }
    },
    update: (state, action) => {
      const item = state.items.find((line) => line.variantId === action.payload.variantId);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, maxFor(item)));
      }
    },
    remove: (state, action) => {
      state.items = state.items.filter((item) => item.variantId !== action.payload);
    },
    clear: (state) => {
      state.items = [];
      state.mergeFailed = false;
    },
    setMergeFailed: (state, action) => {
      state.mergeFailed = action.payload;
    },
    replaceAll: (state, action) => {
      state.items = action.payload;
      state.hydrated = true;
    },
    // Brings saved prices and limits in line with what the server just reported.
    syncFromServer: (state, action) => {
      action.payload.forEach((line) => {
        const item = state.items.find((entry) => entry.variantId === line.variantId);
        if (!item || line.unitPrice === null) {
          return;
        }
        item.snapshot.price = line.salePrice ?? line.unitPrice;
        item.snapshot.availableQty = line.availableQty;
        if (line.status === "qty_reduced") {
          item.quantity = line.quantity;
        }
      });
    },
  },
});

export const { add, update, remove, clear, replaceAll, setMergeFailed, syncFromServer } =
  cartSlice.actions;
export default cartSlice.reducer;

const isItem = (item) =>
  item &&
  Number.isInteger(item.variantId) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0 &&
  typeof item.snapshot === "object";

// Storage can be missing, blocked or edited by hand, so anything odd is treated as empty.
export function loadSavedCart() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter(isItem) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // The cart still works for this visit.
  }
}
