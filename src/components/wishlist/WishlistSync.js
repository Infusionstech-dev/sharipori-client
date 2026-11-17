"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadSavedWishlist, replaceAll } from "@/store/slices/wishlistSlice";

// Loads the saved wishlist, and keeps other open tabs in step with this one.
export default function WishlistSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(replaceAll(loadSavedWishlist()));
    const onStorage = (event) => {
      if (event.key === "ss_wishlist") {
        dispatch(replaceAll(loadSavedWishlist()));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  return null;
}
