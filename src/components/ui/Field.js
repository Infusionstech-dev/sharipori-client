"use client";

import { useId } from "react";

export const controlClass =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-base text-text placeholder:text-text/50 " +
  "focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60 " +
  "border-text/25 aria-invalid:border-red-700";

// Connects a control to its label, hint and error for screen readers.
export default function Field({ id, label, hint, error, children }) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const messageId = `${controlId}-message`;
  const message = error || hint;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={controlId} className="block text-sm font-medium">
          {label}
        </label>
      )}
      {children({
        id: controlId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": message ? messageId : undefined,
      })}
      {message && (
        <p id={messageId} className={error ? "text-sm text-red-700" : "text-sm text-text/70"}>
          {message}
        </p>
      )}
    </div>
  );
}
