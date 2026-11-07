import { baseApi } from "./baseApi";

const payable = (line) => line.salePrice ?? line.unitPrice;
const round = (value) => Math.round(value * 100) / 100;

// Recomputes the totals after an optimistic change, the same way the server does.
const retotal = (cart) => {
  cart.items.forEach((line) => {
    const purchasable = ["ok", "price_changed", "qty_reduced"].includes(line.status);
    line.lineTotal = purchasable ? round(payable(line) * line.quantity) : 0;
  });
  cart.subtotal = round(cart.items.reduce((total, line) => total + line.lineTotal, 0));
  cart.itemCount = cart.items.reduce((total, line) => total + line.quantity, 0);
};

// Every cart response is the whole cart, so it replaces the cached one without a refetch.
const storeCart = async (api, queryFulfilled) => {
  try {
    const { data } = await queryFulfilled;
    api.dispatch(cartApi.util.updateQueryData("getCart", undefined, () => data));
  } catch {
    // The caller shows the error.
  }
};

// Shows the change at once, then keeps the server's version or puts the old cart back.
const optimistic = (change) => async (arg, api) => {
  const patch = api.dispatch(
    cartApi.util.updateQueryData("getCart", undefined, (cart) => {
      change(cart, arg);
      retotal(cart);
    })
  );
  try {
    const { data } = await api.queryFulfilled;
    api.dispatch(cartApi.util.updateQueryData("getCart", undefined, () => data));
  } catch {
    patch.undo();
  }
};

const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query({
      query: () => "/cart",
      transformResponse: (response) => response.data,
      providesTags: ["Cart"],
    }),
    addItem: build.mutation({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      transformResponse: (response) => response.data,
      onQueryStarted: (arg, { dispatch, queryFulfilled }) =>
        storeCart({ dispatch }, queryFulfilled),
    }),
    updateItem: build.mutation({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response) => response.data,
      onQueryStarted: optimistic((cart, { id, quantity }) => {
        const line = cart.items.find((item) => item.id === id);
        if (line) {
          line.quantity = quantity;
        }
      }),
    }),
    removeItem: build.mutation({
      query: (id) => ({ url: `/cart/items/${id}`, method: "DELETE" }),
      transformResponse: (response) => response.data,
      onQueryStarted: optimistic((cart, id) => {
        cart.items = cart.items.filter((item) => item.id !== id);
      }),
    }),
    clearCart: build.mutation({
      query: () => ({ url: "/cart", method: "DELETE" }),
      transformResponse: (response) => response.data,
      onQueryStarted: (arg, { dispatch, queryFulfilled }) =>
        storeCart({ dispatch }, queryFulfilled),
    }),
    mergeCart: build.mutation({
      query: (items) => ({
        url: "/cart/merge",
        method: "POST",
        body: { items },
      }),
      transformResponse: (response) => ({
        cart: response.data,
        skipped: response.meta?.skipped ?? 0,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(cartApi.util.updateQueryData("getCart", undefined, () => data.cart));
        } catch {
          // CartSync keeps the guest items and tries again later.
        }
      },
    }),
    // A query, not a mutation: it saves nothing, and the cart page re-runs it when items change.
    validateCart: build.query({
      query: (items) => ({
        url: "/cart/validate",
        method: "POST",
        body: { items },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
  useMergeCartMutation,
  useValidateCartQuery,
} = cartApi;
