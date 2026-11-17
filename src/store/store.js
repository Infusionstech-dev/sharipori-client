import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";
import cartReducer, {
  add,
  clear,
  remove,
  replaceAll,
  saveCart,
  syncFromServer,
  update,
} from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import wishlistReducer, {
  clear as clearWishlist,
  remove as removeFromWishlist,
  replaceAll as replaceWishlist,
  saveWishlist,
  toggle as toggleWishlist,
} from "./slices/wishlistSlice";

export const makeStore = () => {
  // Writes the guest cart to localStorage after every change to it.
  const cartPersistence = createListenerMiddleware();
  cartPersistence.startListening({
    matcher: isAnyOf(add, update, remove, clear, replaceAll, syncFromServer),
    effect: (action, api) => {
      const { items, hydrated } = api.getState().cart;
      if (hydrated) {
        saveCart(items);
      }
    },
  });

  // The same for the wishlist.
  const wishlistPersistence = createListenerMiddleware();
  wishlistPersistence.startListening({
    matcher: isAnyOf(toggleWishlist, removeFromWishlist, clearWishlist, replaceWishlist),
    effect: (action, api) => {
      const { ids, hydrated } = api.getState().wishlist;
      if (hydrated) {
        saveWishlist(ids);
      }
    },
  });

  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      ui: uiReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(cartPersistence.middleware, wishlistPersistence.middleware)
        .concat(baseApi.middleware),
  });
};
