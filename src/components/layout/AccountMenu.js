"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "@/components/ui/Skeleton";
import { useLogoutMutation } from "@/store/api/authApi";
import { baseApi } from "@/store/api/baseApi";
import { logout } from "@/store/slices/authSlice";

const ITEM_CLASS =
  "block w-full px-4 py-2 text-left text-sm text-text hover:bg-soft focus-visible:bg-soft focus-visible:outline-none";

export default function AccountMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [logoutRequest] = useLogoutMutation();

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onLogout = async () => {
    setOpen(false);
    await logoutRequest();
    router.push("/");
    dispatch(logout({ byUser: true }));
    dispatch(baseApi.util.resetApiState());
  };

  if (status === "idle" || status === "checking") {
    return <Skeleton className="h-6 w-16 opacity-40" />;
  }

  if (status !== "authenticated") {
    return (
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Login
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className="min-h-11 rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {user?.name ?? "Account"}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg bg-white py-1 shadow-lg">
          <Link href="/account" className={ITEM_CLASS} onClick={() => setOpen(false)}>
            My account
          </Link>
          <Link href="/account/orders" className={ITEM_CLASS} onClick={() => setOpen(false)}>
            Orders
          </Link>
          <button type="button" className={ITEM_CLASS} onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
