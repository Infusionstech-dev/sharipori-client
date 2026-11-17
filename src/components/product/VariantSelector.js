"use client";

import { useState } from "react";
import clsx from "clsx";
import SizeGuideModal from "./SizeGuideModal";

const SIZE_CLASS =
  "min-h-11 min-w-11 rounded-lg border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const uniqueBy = (items) => [...new Map(items.map((item) => [item.id, item])).values()];

export default function VariantSelector({ variants, selected, onSelect }) {
  const [guideOpen, setGuideOpen] = useState(false);
  const colors = uniqueBy(variants.map((variant) => variant.color).filter(Boolean));
  const sizes = uniqueBy(variants.map((variant) => variant.size).filter(Boolean));
  const available = variants.filter((variant) => variant.inStock);

  const hasChoice = colors.length > 1 || sizes.length > 1;
  const showGuide = sizes.some((size) => size.group !== "free");
  if (!hasChoice && !showGuide) {
    return null;
  }

  // Picking a colour keeps the current size when that exists, otherwise takes its first in-stock size.
  const pickColor = (colorId) => {
    const options = available.filter((variant) => variant.color?.id === colorId);
    const sameSize = options.find((variant) => variant.size?.id === selected?.size?.id);
    onSelect((sameSize ?? options[0]).id);
  };

  const sizeVariant = (sizeId) =>
    available.find(
      (variant) =>
        variant.size?.id === sizeId && (!selected?.color || variant.color?.id === selected.color.id)
    );

  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <fieldset data-size-picker>
          <legend className="mb-2 text-sm font-semibold">
            Colour{selected?.color && <span className="font-normal">: {selected.color.name}</span>}
          </legend>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const inStock = available.some((variant) => variant.color?.id === color.id);
              const active = selected?.color?.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.name}
                  aria-label={inStock ? color.name : `${color.name}, out of stock`}
                  aria-pressed={active}
                  disabled={!inStock}
                  onClick={() => pickColor(color.id)}
                  className={clsx(
                    "flex size-11 items-center justify-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30",
                    active ? "border-primary" : "border-transparent"
                  )}
                >
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: color.hex }}
                    className="size-8 rounded-full ring-1 ring-text/30"
                  />
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {sizes.length > 0 && (
        <fieldset data-size-picker>
          <div className="mb-2 flex items-center justify-between gap-2">
            <legend className="text-sm font-semibold">Size</legend>
            {showGuide && (
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="min-h-8 rounded text-sm text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Size guide
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const match = sizeVariant(size.id);
              const active = selected?.size?.id === size.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={active}
                  disabled={!match}
                  onClick={() => onSelect(match.id)}
                  className={clsx(
                    SIZE_CLASS,
                    active
                      ? "border-primary bg-soft font-medium text-primary"
                      : "border-text/25 hover:border-primary",
                    "disabled:cursor-not-allowed disabled:border-text/10 disabled:text-text/40 disabled:line-through disabled:hover:border-text/10"
                  )}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {showGuide && (
        <SizeGuideModal
          open={guideOpen}
          onClose={() => setGuideOpen(false)}
          initialGroup={sizes.find((size) => size.group !== "free")?.group}
        />
      )}
    </div>
  );
}
