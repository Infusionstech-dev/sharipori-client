"use client";

import { Minus, Plus } from "lucide-react";

const BUTTON_CLASS =
  "flex size-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:text-text/30";

export default function QuantityStepper({ value, max, onChange, disabled }) {
  return (
    <div
      role="group"
      aria-label="Quantity"
      className="inline-flex items-center rounded-lg border border-text/25"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className={BUTTON_CLASS}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span aria-live="polite" className="w-8 text-center text-sm font-medium">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={BUTTON_CLASS}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
