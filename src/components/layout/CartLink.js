"use client";

import Link from "next/link";
import clsx from "clsx";
import useCart from "@/hooks/useCart";
import { CartIcon } from "./icons";

const MAX_SHOWN = 99;

export default function CartLink({ className, iconClassName, children }) {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} items` : "Cart"}
      className={clsx("relative", className)}
    >
      <span className="relative">
        <CartIcon className={iconClassName} />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-text"
          >
            {count > MAX_SHOWN ? `${MAX_SHOWN}+` : count}
          </span>
        )}
      </span>
      {children}
    </Link>
  );
}
