"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import useCart from "@/hooks/useCart";
import { serverMessage } from "@/lib/authForms";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";

// What the guest cart keeps about a variant, so it can show the line without asking the server.
export const snapshotOf = (product, variant) => ({
  name: product.nameEn,
  slug: product.slug,
  image: product.images?.[0]?.url ?? product.image ?? null,
  price: variant.salePrice ?? variant.price,
  size: variant.size?.label ?? null,
  color: variant.color?.name ?? null,
  availableQty: variant.availableQty,
});

// Adds, then opens the cart drawer, or shows why it could not.
export default function useAddToCart() {
  const dispatch = useDispatch();
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  const addToCart = async (product, variant, quantity = 1, { openDrawer = true } = {}) => {
    setAdding(true);
    try {
      await add({
        variantId: variant.id,
        quantity,
        snapshot: snapshotOf(product, variant),
      });
      if (openDrawer) {
        dispatch(setCartDrawerOpen(true));
      }
      return true;
    } catch (error) {
      toast.error(serverMessage(error, "Could not add to cart. Please try again."));
      return false;
    } finally {
      setAdding(false);
    }
  };

  return { addToCart, adding };
}
