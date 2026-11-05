"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { setMobileMenuOpen } from "@/store/slices/uiSlice";
import CartLink from "./CartLink";
import { GridIcon, HomeIcon, UserIcon } from "./icons";

const ITEM_CLASS =
  "flex flex-col items-center justify-center gap-0.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary";

const itemClass = (active) => clsx(ITEM_CLASS, active ? "font-semibold text-primary" : "text-text/70");

export default function BottomNav() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-4 border-t border-soft bg-white md:hidden"
    >
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={itemClass(pathname === "/")}
      >
        <HomeIcon className="size-5" />
        Home
      </Link>
      <button
        type="button"
        onClick={() => dispatch(setMobileMenuOpen(true))}
        className={itemClass(false)}
      >
        <GridIcon className="size-5" />
        Categories
      </button>
      <CartLink className={itemClass(pathname === "/cart")} iconClassName="size-5">
        Cart
      </CartLink>
      <Link
        href="/account"
        aria-current={pathname.startsWith("/account") ? "page" : undefined}
        className={itemClass(pathname.startsWith("/account"))}
      >
        <UserIcon className="size-5" />
        Account
      </Link>
    </nav>
  );
}
