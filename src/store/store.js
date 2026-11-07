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

  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      ui: uiReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(cartPersistence.middleware).concat(baseApi.middleware),
  });
};
