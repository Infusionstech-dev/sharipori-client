import { baseApi } from "./baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query({
      query: (params) => ({ url: "/products", params }),
      transformResponse: (response) => ({ data: response.data, meta: response.meta }),
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
