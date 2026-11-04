import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout, setCredentials } from "../slices/authSlice";

const refreshMutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = getState().auth;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// A 401 from /auth/* means bad credentials or a dead session, not an expired access token.
const isAuthRequest = (args) => {
  const url = typeof args === "string" ? args : args.url;
  return url.startsWith("/auth/");
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await refreshMutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || isAuthRequest(args)) {
    return result;
  }

  if (refreshMutex.isLocked()) {
    // Another request is already refreshing: wait for it, then retry with the new token.
    await refreshMutex.waitForUnlock();
    return baseQuery(args, api, extraOptions);
  }

  const release = await refreshMutex.acquire();
  try {
    const refresh = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refresh.data?.data?.accessToken) {
      api.dispatch(setCredentials(refresh.data.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  } finally {
    release();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me", "Category", "Product", "Cart", "Order", "Address", "Wishlist"],
  endpoints: () => ({}),
});
