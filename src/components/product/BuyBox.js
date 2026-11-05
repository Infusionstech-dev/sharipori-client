"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import { formatBDT } from "@/lib/format";
import { siteConfig } from "@/lib/siteConfig";
import { addToCartRequested } from "@/store/slices/cartSlice";
import QuantityStepper from "./QuantityStepper";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

const whatsappHref = (product, variant, packageSize, quantity) => {
  const details = [variant.color?.name, variant.size?.label, packageSize?.label]
    .filter(Boolean)
    .join(" / ");
  const message = [
    `Hello, I would like to order ${product.nameEn}`,
    details && `Variant: ${details}`,
    `Quantity: ${quantity}`,
    `${SITE_URL}/product/${product.slug}?v=${variant.id}`,
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

// variant is null until a valid choice is made. displayVariant still prices the sticky bar.
export default function BuyBox({ product, variant, displayVariant, packageSize }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const max = variant?.availableQty ?? 1;
  // Moving to a variant with less stock must not keep a quantity that it cannot fill.
  const shownQuantity = Math.min(quantity, Math.max(max, 1));

  const shown = displayVariant ?? product;
  const addLabel = displayVariant ? "Add to cart" : "Out of stock";

  // T6.1 replaces this with the real cart.
  const add = (message) => {
    dispatch(
      addToCartRequested({ variantId: variant.id, quantity: shownQuantity, size: packageSize?.id })
    );
    toast(message);
  };

  return (
    <div className="space-y-3">
      <QuantityStepper value={shownQuantity} max={max} onChange={setQuantity} disabled={!variant} />
      {displayVariant && !variant && (
        <p className="text-sm text-text/70">Choose a size to continue.</p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          size="lg"
          disabled={!variant}
          onClick={() => add("Add to cart is coming soon")}
        >
          {addLabel}
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={!variant}
          onClick={() => add("Buy now is coming soon")}
        >
          Buy now
        </Button>
      </div>
      {siteConfig.whatsappNumber &&
        (variant ? (
          <a
            href={whatsappHref(product, variant, packageSize, shownQuantity)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-text/25 text-sm font-medium hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Order on WhatsApp
          </a>
        ) : (
          <Button size="lg" variant="ghost" disabled className="w-full">
            Order on WhatsApp
          </Button>
        ))}

      <div
        data-sticky-buybar
        className="fixed inset-x-0 bottom-14 z-20 flex items-center justify-between gap-3 border-t border-soft bg-white px-4 py-2 md:hidden"
      >
        <span className="font-semibold text-primary">
          {formatBDT(shown.salePrice ?? shown.price)}
        </span>
        <Button disabled={!variant} onClick={() => add("Add to cart is coming soon")}>
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
