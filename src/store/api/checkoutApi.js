import { baseApi } from "./baseApi";

const checkoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDeliveryZones: build.query({
      query: () => "/delivery-zones",
      transformResponse: (response) => response.data,
    }),
    // A query, not a mutation: it saves nothing, and re-runs whenever its arguments change.
    getQuote: build.query({
      query: (body) => ({ url: "/checkout/quote", method: "POST", body }),
      transformResponse: (response) => response.data,
    }),
    placeOrder: build.mutation({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Order"],
    }),
    trackOrder: build.query({
      query: ({ orderNo, phone }) => ({ url: "/orders/track", params: { orderNo, phone } }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetDeliveryZonesQuery,
  useGetQuoteQuery,
  usePlaceOrderMutation,
  useTrackOrderQuery,
} = checkoutApi;
