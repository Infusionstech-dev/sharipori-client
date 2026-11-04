"use client";

import { useRef } from "react";

const LENGTH = 6;

export default function CodeInput({ value = "", onChange, error, label = "Verification code" }) {
  const boxes = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  const focusBox = (index) => boxes.current[Math.min(index, LENGTH - 1)]?.focus();

  const fill = (index, text) => {
    const typed = text.replace(/\D/g, "").slice(0, LENGTH - index).split("");
    if (!typed.length) {
      return;
    }
    const next = [...digits];
    typed.forEach((digit, offset) => {
      next[index + offset] = digit;
    });
    onChange(next.join(""));
    focusBox(index + typed.length);
  };

  const onKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const target = digits[index] ? index : Math.max(index - 1, 0);
      const next = [...digits];
      next[target] = "";
      onChange(next.join(""));
      focusBox(target);
    } else if (event.key === "ArrowLeft") {
      focusBox(Math.max(index - 1, 0));
    } else if (event.key === "ArrowRight") {
      focusBox(index + 1);
    }
  };

  return (
    <fieldset className="space-y-1">
      <legend className="mb-1 block text-sm font-medium">{label}</legend>
      <div className="flex gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              boxes.current[index] = element;
            }}
            value={digit}
            autoFocus={index === 0}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1} of ${LENGTH}`}
            aria-invalid={error ? true : undefined}
            onFocus={(event) => event.target.select()}
            onChange={(event) => fill(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            onPaste={(event) => {
              event.preventDefault();
              fill(index, event.clipboardData.getData("text"));
            }}
            className="h-12 w-full min-w-0 rounded-lg border border-text/25 bg-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary aria-invalid:border-red-700"
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </fieldset>
  );
}
