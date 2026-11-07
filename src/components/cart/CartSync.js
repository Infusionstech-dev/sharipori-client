"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useMergeCartMutation } from "@/store/api/cartApi";
import { clear, loadSavedCart, replaceAll } from "@/store/slices/cartSlice";

// Loads the saved guest cart, and after login moves it into the customer's server cart.
export default function CartSync() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const { items, hydrated } = useSelector((state) => state.cart);
  const [mergeCart] = useMergeCartMutation();
  const merging = useRef(false);

  useEffect(() => {
    dispatch(replaceAll(loadSavedCart()));
  }, [dispatch]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !hydrated || !items.length || merging.current) {
      return;
    }
    merging.current = true;
    mergeCart(items.map(({ variantId, quantity }) => ({ variantId, quantity })))
      .unwrap()
      .then(({ skipped }) => {
        dispatch(clear());
        if (skipped > 0) {
          toast(
            `${skipped} item${skipped === 1 ? " is" : "s are"} no longer available and ${skipped === 1 ? "was" : "were"} left out of your cart`
          );
        }
      })
      // The guest items stay saved, so the next page load tries again.
      .catch(() => {})
      .finally(() => {
        merging.current = false;
      });
  }, [authStatus, hydrated, items, mergeCart, dispatch]);

  return null;
}
