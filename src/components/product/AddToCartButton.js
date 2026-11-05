"use client";

import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

// Sits above the card's link, so pressing it does not open the product. T6.1 adds the cart.
export default function AddToCartButton({ name, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`Add to cart: ${name}`}
      onClick={() => toast("Add to cart is coming soon")}
      className="relative z-10 mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary text-sm font-medium text-primary hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:border-text/20 disabled:text-text/40 disabled:hover:bg-transparent"
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      Add to cart
    </button>
  );
}
