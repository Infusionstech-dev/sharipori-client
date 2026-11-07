"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PriceTag from "@/components/ui/PriceTag";
import { useLazyGetProductQuery } from "@/store/api/productApi";
import useAddToCart from "./useAddToCart";
import VariantSelector from "./VariantSelector";

function VariantPickerModal({ product, onClose }) {
  const { addToCart, adding } = useAddToCart();
  const [variantId, setVariantId] = useState(
    () => product.variants.find((variant) => variant.inStock)?.id ?? null
  );
  const variant = product.variants.find((item) => item.id === variantId) ?? null;

  return (
    <Modal open onClose={onClose} title={product.nameEn}>
      <div className="space-y-4">
        {variant && <PriceTag price={variant.price} salePrice={variant.salePrice} />}
        <VariantSelector variants={product.variants} selected={variant} onSelect={setVariantId} />
        <Button
          size="lg"
          className="w-full"
          loading={adding}
          disabled={!variant}
          onClick={async () => {
            if (await addToCart(product, variant)) {
              onClose();
            }
          }}
        >
          {variant ? "Add to cart" : "Out of stock"}
        </Button>
      </div>
    </Modal>
  );
}

// Sits above the card's link, so pressing it does not open the product.
// One in-stock choice is added straight away; more than one opens a picker.
export default function AddToCartButton({ name, slug, disabled }) {
  const [loadProduct, { isFetching }] = useLazyGetProductQuery();
  const { addToCart, adding } = useAddToCart();
  const [picking, setPicking] = useState(null);

  const onClick = async () => {
    let product;
    try {
      product = await loadProduct(slug, true).unwrap();
    } catch {
      toast.error("Could not load this product. Please try again.");
      return;
    }
    const inStock = product.variants.filter((variant) => variant.inStock);
    if (!inStock.length) {
      toast.error("This item is out of stock");
    } else if (product.variants.length === 1) {
      await addToCart(product, inStock[0]);
    } else {
      setPicking(product);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled || isFetching || adding}
        aria-label={`Add to cart: ${name}`}
        onClick={onClick}
        className="relative z-10 mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary text-sm font-medium text-primary hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:border-text/20 disabled:text-text/40 disabled:hover:bg-transparent"
      >
        <ShoppingBag className="size-4" aria-hidden="true" />
        Add to cart
      </button>
      {picking && <VariantPickerModal product={picking} onClose={() => setPicking(null)} />}
    </>
  );
}
