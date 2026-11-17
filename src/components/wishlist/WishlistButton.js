"use client";

import clsx from "clsx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HeartIcon } from "@/components/layout/icons";
import useMounted from "@/hooks/useMounted";
import { MAX_WISHLIST, toggle } from "@/store/slices/wishlistSlice";

// A heart that saves or removes one product. The caller positions it (absolute or relative), and
// z-10 keeps it above a card's stretched link.
export default function WishlistButton({ productId, name, className }) {
  const dispatch = useDispatch();
  const { ids, hydrated } = useSelector((state) => state.wishlist);
  const mounted = useMounted();
  const ready = mounted && hydrated;
  const saved = ready && ids.includes(productId);

  const onClick = () => {
    if (!saved && ids.length >= MAX_WISHLIST) {
      toast.error(`Your wishlist is full (${MAX_WISHLIST} items). Remove one first.`);
      return;
    }
    dispatch(toggle(productId));
    toast.success(saved ? "Removed from your wishlist" : "Saved to your wishlist");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!ready}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={clsx(
        "z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60",
        className
      )}
    >
      <HeartIcon className={clsx("size-5", saved && "fill-current")} />
    </button>
  );
}
