"use client";

import { useState } from "react";

const STEP = 50;
const THUMB_CLASS =
  "pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent accent-primary " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto";
const INPUT_CLASS =
  "min-h-11 w-full rounded-lg border border-text/25 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

// Parents give this a key built from the applied prices, so a URL change resets what is typed here.
export default function PriceRange({ range, minPrice, maxPrice, onCommit }) {
  const floor = Math.floor(range.min / STEP) * STEP;
  const ceiling = Math.ceil(range.max / STEP) * STEP;
  const [low, setLow] = useState(String(minPrice ?? floor));
  const [high, setHigh] = useState(String(maxPrice ?? ceiling));

  const commit = () => {
    const clamp = (value, fallback) =>
      Number.isFinite(value) && value !== 0 ? Math.min(Math.max(value, floor), ceiling) : fallback;
    const a = clamp(Number(low), floor);
    const b = clamp(Number(high), ceiling);
    const [nextLow, nextHigh] = a <= b ? [a, b] : [b, a];
    setLow(String(nextLow));
    setHigh(String(nextHigh));
    onCommit(nextLow > floor ? nextLow : null, nextHigh < ceiling ? nextHigh : null);
  };

  const commitOnEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }
  };

  const lowValue = Number(low) || floor;
  const highValue = Number(high) || ceiling;

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-2.5 h-1 rounded bg-soft" />
        <input
          type="range"
          aria-label="Lowest price"
          min={floor}
          max={ceiling}
          step={STEP}
          value={Math.min(lowValue, highValue)}
          onChange={(event) => setLow(event.target.value)}
          onPointerUp={commit}
          onKeyUp={commit}
          className={THUMB_CLASS}
        />
        <input
          type="range"
          aria-label="Highest price"
          min={floor}
          max={ceiling}
          step={STEP}
          value={Math.max(lowValue, highValue)}
          onChange={(event) => setHigh(event.target.value)}
          onPointerUp={commit}
          onKeyUp={commit}
          className={THUMB_CLASS}
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          aria-label="Minimum price"
          min={floor}
          max={ceiling}
          value={low}
          onChange={(event) => setLow(event.target.value)}
          onBlur={commit}
          onKeyDown={commitOnEnter}
          className={INPUT_CLASS}
        />
        <span aria-hidden="true">–</span>
        <input
          type="number"
          inputMode="numeric"
          aria-label="Maximum price"
          min={floor}
          max={ceiling}
          value={high}
          onChange={(event) => setHigh(event.target.value)}
          onBlur={commit}
          onKeyDown={commitOnEnter}
          className={INPUT_CLASS}
        />
      </div>
    </div>
  );
}
