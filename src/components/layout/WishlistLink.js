"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSelector } from "react-redux";
import useMounted from "@/hooks/useMounted";
import { HeartIcon } from "./icons";

const MAX_SHOWN = 99;

export default function WishlistLink({ className }) {
  const mounted = useMounted();
  const saved = useSelector((state) => state.wishlist.ids.length);
  const count = mounted ? saved : 0;

  return (
    <Link
      href="/wishlist"
      aria-label={count ? `Wishlist, ${count} items` : "Wishlist"}
      className={clsx("relative", className)}
    >
      <span className="relative">
        <HeartIcon />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-text"
          >
            {count > MAX_SHOWN ? `${MAX_SHOWN}+` : count}
          </span>
        )}
      </span>
    </Link>
  );
}
