import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout, setCredentials } from "../slices/authSlice";

const REFRESH_URL = "/auth/refresh";
// A 401 from these means bad credentials or a dead session, not an expired access token.
const NO_REAUTH_URLS = ["/auth/login", "/auth/register", REFRESH_URL, "/auth/logout"];

const refreshMutex = new Mutex();

export const isSessionRejected = (status) => status === 401 || status === 403;

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

const urlOf = (args) => (typeof args === "string" ? args : args.url);

// The mutex only covers one tab. Tabs share the refresh cookie, and two tabs sending the same
// token looks like theft to the API, so refreshes also queue across tabs. Each one then sends
// whatever cookie the previous refresh left behind.
const sendRefresh = (api, extraOptions) => {
  const send = () => baseQuery({ url: REFRESH_URL, method: "POST" }, api, extraOptions);
  return navigator.locks ? navigator.locks.request("shari-auth-refresh", send) : send();
};

const needsRefresh = (args, error) => {
  if (NO_REAUTH_URLS.includes(urlOf(args))) {
    return false;
  }
  return error?.status === 401 || error?.data?.code === "TOKEN_EXPIRED";
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  if (urlOf(args) === REFRESH_URL) {
    return sendRefresh(api, extraOptions);
  }

  await refreshMutex.waitForUnlock();
  const tokenUsed = api.getState().auth.accessToken;
  const result = await baseQuery(args, api, extraOptions);

  if (!needsRefresh(args, result.error)) {
    return result;
  }

  if (refreshMutex.isLocked()) {
    // Another request is already refreshing: wait for it, then retry with the new token.
    await refreshMutex.waitForUnlock();
    return baseQuery(args, api, extraOptions);
  }

  const release = await refreshMutex.acquire();
  try {
    // A refresh may have finished while this request was in flight.
    if (api.getState().auth.accessToken !== tokenUsed) {
      return await baseQuery(args, api, extraOptions);
    }

    const refresh = await sendRefresh(api, extraOptions);

    if (refresh.data?.data?.accessToken) {
      api.dispatch(setCredentials(refresh.data.data));
      return await baseQuery(args, api, extraOptions);
    }

    // A rate limit or network failure says nothing about the session, so keep it.
    if (isSessionRejected(refresh.error?.status)) {
      api.dispatch(logout());
    }
    return result;
  } finally {
    release();
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me", "Category", "Product", "Cart", "Order", "Address", "Wishlist"],
  endpoints: () => ({}),
});
