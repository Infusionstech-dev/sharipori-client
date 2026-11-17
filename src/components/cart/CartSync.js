"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useMergeCartMutation } from "@/store/api/cartApi";
import { clear, loadSavedCart, replaceAll, setMergeFailed } from "@/store/slices/cartSlice";

// A failed merge (a slow or waking server) is tried again after these waits, then given up on.
const RETRY_DELAYS_MS = [2000, 5000, 10000];

// Loads the saved guest cart, and after login moves it into the customer's server cart.
export default function CartSync() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const { items, hydrated } = useSelector((state) => state.cart);
  const [mergeCart] = useMergeCartMutation();
  const merging = useRef(false);
  const failures = useRef(0);
  const retryTimer = useRef(null);
  // Changing this runs the merge effect again for a retry.
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    dispatch(replaceAll(loadSavedCart()));
    return () => clearTimeout(retryTimer.current);
  }, [dispatch]);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      failures.current = 0;
      return;
    }
    if (!hydrated || !items.length || merging.current) {
      return;
    }
    merging.current = true;
    mergeCart(items.map(({ variantId, quantity }) => ({ variantId, quantity })))
      .unwrap()
      .then(({ skipped }) => {
        failures.current = 0;
        dispatch(clear());
        if (skipped > 0) {
          toast(
            `${skipped} item${skipped === 1 ? " is" : "s are"} no longer available and ${skipped === 1 ? "was" : "were"} left out of your cart`
          );
        }
      })
      .catch(() => {
        const delay = RETRY_DELAYS_MS[failures.current];
        failures.current += 1;
        if (delay) {
          retryTimer.current = setTimeout(() => setRetryCount((count) => count + 1), delay);
        } else {
          // The guest items stay saved, so the next page load tries again.
          dispatch(setMergeFailed(true));
          toast.error("We could not add your saved items to your cart. Please refresh the page.");
        }
      })
      .finally(() => {
        merging.current = false;
      });
  }, [authStatus, hydrated, items, mergeCart, dispatch, retryCount]);

  return null;
}
