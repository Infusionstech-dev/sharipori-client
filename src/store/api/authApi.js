import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    refresh: builder.mutation({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    me: builder.query({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: "/auth/change-password", method: "PATCH", body }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
