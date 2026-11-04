"use client";

import { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { useRefreshMutation } from "@/store/api/authApi";
import { isSessionRejected } from "@/store/api/baseApi";
import {
  logout,
  sessionCheckStarted,
  sessionUnavailable,
  setCredentials,
} from "@/store/slices/authSlice";

export default function AuthBootstrap() {
  const dispatch = useDispatch();
  const store = useStore();
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    // Read from the store so StrictMode's second effect run cannot refresh twice. A second
    // call would replay a rotated token, which the API treats as theft and logs everyone out.
    if (store.getState().auth.status !== "idle") {
      return;
    }

    dispatch(sessionCheckStarted());
    refresh()
      .unwrap()
      .then((response) => dispatch(setCredentials(response.data)))
      .catch((err) => dispatch(isSessionRejected(err?.status) ? logout() : sessionUnavailable()));
  }, [dispatch, refresh, store]);

  return null;
}
