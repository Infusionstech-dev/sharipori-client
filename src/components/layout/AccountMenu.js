"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { UserIcon } from "./icons";
import useLogout from "./useLogout";

const ITEM_CLASS =
  "block w-full px-4 py-2 text-left text-sm text-text hover:bg-soft focus-visible:bg-soft focus-visible:outline-none";
const ICON_BUTTON_CLASS =
  "flex size-11 items-center justify-center rounded-lg hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function AccountMenu() {
  const { status, user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const logout = useLogout();

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
    await logout();
  };

  if (status !== "authenticated") {
    // The same icon while the session is checked, so nothing moves when it finishes.
    return (
      <Link href="/login" aria-label="Login" title="Login" className={ICON_BUTTON_CLASS}>
        <UserIcon />
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={`Account menu for ${user?.name ?? "your account"}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={ICON_BUTTON_CLASS}
      >
        <UserIcon />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg bg-white py-1 shadow-lg">
          {user?.name && (
            <p className="truncate border-b border-soft px-4 py-2 text-sm font-medium">
              {user.name}
            </p>
          )}
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
