import { baseApi } from "./baseApi";

const data = (response) => response.data;

const accountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => "/me",
      transformResponse: data,
      providesTags: ["Me"],
    }),
    updateProfile: build.mutation({
      query: (body) => ({ url: "/me", method: "PUT", body }),
      transformResponse: data,
      invalidatesTags: ["Me"],
    }),
    getAddresses: build.query({
      query: () => "/me/addresses",
      transformResponse: data,
      providesTags: ["Address"],
    }),
    createAddress: build.mutation({
      query: (body) => ({ url: "/me/addresses", method: "POST", body }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: build.mutation({
      query: ({ id, ...body }) => ({ url: `/me/addresses/${id}`, method: "PUT", body }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: build.mutation({
      query: (id) => ({ url: `/me/addresses/${id}/default`, method: "PATCH" }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: build.mutation({
      query: (id) => ({ url: `/me/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Address"],
    }),
    getMyOrders: build.query({
      query: (params) => ({ url: "/orders", params }),
      transformResponse: (response) => ({ data: response.data, meta: response.meta }),
      providesTags: ["Order"],
    }),
    getMyOrder: build.query({
      query: (orderNo) => `/orders/${orderNo}`,
      transformResponse: data,
      providesTags: (result, error, orderNo) => [{ type: "Order", id: orderNo }],
    }),
    cancelOrder: build.mutation({
      query: ({ orderNo, reason }) => ({
        url: `/orders/${orderNo}/cancel`,
        method: "POST",
        body: { reason },
      }),
      // The page shows the cancelled order at once; the refetch then brings the server's timeline.
      onQueryStarted: async ({ orderNo }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            accountApi.util.updateQueryData("getMyOrder", orderNo, (order) => {
              order.status = "cancelled";
              order.canCancel = false;
              order.timeline.push({ status: "cancelled", at: new Date().toISOString() });
            })
          );
        } catch {
          // The page shows the error.
        }
      },
      invalidatesTags: (result, error, { orderNo }) =>
        error ? [] : ["Order", { type: "Order", id: orderNo }, "Product"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useCancelOrderMutation,
} = accountApi;
