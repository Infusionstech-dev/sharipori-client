"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/store/api/authApi";
import { baseApi } from "@/store/api/baseApi";
import { logout } from "@/store/slices/authSlice";

export default function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutRequest] = useLogoutMutation();

  return async () => {
    await logoutRequest();
    router.push("/");
    dispatch(logout({ byUser: true }));
    dispatch(baseApi.util.resetApiState());
  };
}
