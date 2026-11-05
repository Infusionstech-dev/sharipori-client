"use client";

import { useState } from "react";
import Gallery from "./Gallery";
import BuyBox from "./BuyBox";
import ProductInfo from "./ProductInfo";
import VariantSelector from "./VariantSelector";

const defaultVariantId = (variants, requestedId) => {
  const usable = variants.filter((variant) => variant.inStock);
  return (usable.find((variant) => variant.id === requestedId) ?? usable[0])?.id ?? null;
};

export default function ProductDetail({ product, requestedVariantId, packageItems }) {
  const { variants } = product;
  const [variantId, setVariantId] = useState(() =>
    defaultVariantId(variants, requestedVariantId)
  );
  // A package's size choice is not a variant: it travels with the order instead.
  const [packageSize, setPackageSize] = useState(null);
  const variant = variants.find((item) => item.id === variantId) ?? null;
  const sizeOptions = product.sizeOptions ?? [];
  const needsPackageSize = sizeOptions.length > 0 && !packageSize;

  const selectVariant = (id) => {
    setVariantId(id);
    // Replace, not push: Back should leave the product, not undo each colour tried.
    window.history.replaceState(null, "", `${window.location.pathname}?v=${id}`);
  };

  return (
    <div className="grid gap-6 pb-20 md:grid-cols-2 md:gap-10 md:pb-0">
      <Gallery images={product.images} colorId={variant?.color?.id ?? null} name={product.nameEn} />
      <div className="min-w-0 space-y-5">
        <ProductInfo product={product} variant={variant} />
        {packageItems}
        <VariantSelector variants={variants} selected={variant} onSelect={selectVariant} />
        {sizeOptions.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Choose size</legend>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={packageSize?.id === size.id}
                  onClick={() => setPackageSize(size)}
                  className={`min-h-11 min-w-11 rounded-lg border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    packageSize?.id === size.id
                      ? "border-primary bg-soft font-medium text-primary"
                      : "border-text/25 hover:border-primary"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <BuyBox
          product={product}
          variant={needsPackageSize ? null : variant}
          displayVariant={variant}
          packageSize={packageSize}
        />
      </div>
    </div>
  );
}
