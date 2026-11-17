"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { formatBDT } from "@/lib/format";
import QuantityStepper from "./QuantityStepper";
import useAddToCart from "./useAddToCart";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

const whatsappHref = (whatsappNumber, product, variant, packageSize, quantity) => {
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
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

// variant is null until a valid choice is made. displayVariant still prices the sticky bar.
export default function BuyBox({ product, variant, displayVariant, packageSize, whatsappNumber }) {
  const router = useRouter();
  const { addToCart, adding } = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const max = variant?.availableQty ?? 1;
  // Moving to a variant with less stock must not keep a quantity that it cannot fill.
  const shownQuantity = Math.min(quantity, Math.max(max, 1));

  const shown = displayVariant ?? product;
  const addLabel = displayVariant ? "Add to cart" : "Out of stock";
  // In stock, but a size still has to be picked. The buttons stay clickable so they can say so.
  const needsChoice = Boolean(displayVariant) && !variant;
  const [triedWithoutSize, setTriedWithoutSize] = useState(false);

  const askForSize = () => {
    setTriedWithoutSize(true);
    toast.error("Please select a size first.", { id: "select-size" });
    document
      .querySelector("[data-size-picker]")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // The cart API has no field for a package's size yet, so that choice is not saved with the line.
  const add = () => (needsChoice ? askForSize() : addToCart(product, variant, shownQuantity));

  const buyNow = async () => {
    if (needsChoice) {
      askForSize();
      return;
    }
    if (await addToCart(product, variant, shownQuantity, { openDrawer: false })) {
      router.push("/checkout");
    }
  };

  return (
    <div className="space-y-3">
      <QuantityStepper value={shownQuantity} max={max} onChange={setQuantity} disabled={!variant} />
      {needsChoice &&
        (triedWithoutSize ? (
          <p role="alert" className="text-sm font-medium text-red-700">
            ⚠ Please select a size before adding to cart.
          </p>
        ) : (
          <p className="text-sm text-text/70">Choose a size to continue.</p>
        ))}
      <div className="grid gap-2 sm:grid-cols-2">
        <Button size="lg" disabled={!displayVariant} loading={adding} onClick={add}>
          {addLabel}
        </Button>
        <Button size="lg" variant="outline" disabled={!displayVariant || adding} onClick={buyNow}>
          Buy now
        </Button>
      </div>
      {whatsappNumber &&
        (variant ? (
          <a
            href={whatsappHref(whatsappNumber, product, variant, packageSize, shownQuantity)}
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
        <Button disabled={!displayVariant} loading={adding} onClick={add}>
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
