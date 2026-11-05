import { baseApi } from "./baseApi";

const searchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSearchSuggestions: build.query({
      query: (q) => ({ url: "/search/suggest", params: { q } }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetSearchSuggestionsQuery } = searchApi;
