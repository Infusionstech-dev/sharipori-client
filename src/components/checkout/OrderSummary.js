"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import RemoteImage from "@/components/ui/RemoteImage";
import Skeleton from "@/components/ui/Skeleton";
import { formatBDT } from "@/lib/format";

function Row({ label, value, strong, accent }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-base font-semibold" : "text-sm"}`}>
      <dt>{label}</dt>
      <dd className={accent ? "text-green-700" : undefined}>{value}</dd>
    </div>
  );
}

// quote is the latest /checkout/quote answer. Coupon state lives in the checkout page,
// which sends the code with every quote.
export default function OrderSummary({
  items,
  quote,
  quoting,
  coupon,
  couponError,
  onApply,
  onRemove,
}) {
  const [code, setCode] = useState("");
  const delivery = (() => {
    if (!quote) return "—";
    if (quote.freeDeliveryApplied) return "Free";
    return quote.deliveryCharge ? formatBDT(quote.deliveryCharge) : "Choose an area";
  })();

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((line) => (
          <li key={line.key} className="flex items-center gap-3">
            <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-soft">
              {line.image && (
                <RemoteImage src={line.image} fill sizes="48px" className="object-cover" />
              )}
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-text text-[10px] text-white">
                {line.quantity}
              </span>
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="line-clamp-1 font-medium">{line.name}</span>
              <span className="block text-xs text-text/70">
                {[line.color, line.size].filter(Boolean).join(" / ")}
              </span>
            </span>
            <span className="text-sm">{formatBDT(line.lineTotal)}</span>
          </li>
        ))}
      </ul>

      {coupon ? (
        <div className="flex items-center justify-between rounded-lg bg-soft px-3 py-2 text-sm">
          <span>
            Coupon <strong>{coupon}</strong> {couponError ? "not applied" : "applied"}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="min-h-9 rounded px-2 font-medium text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            aria-label="Coupon code"
            placeholder="Coupon code"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (code.trim()) onApply(code.trim());
              }
            }}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-text/25 bg-white px-3 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button variant="outline" disabled={!code.trim()} onClick={() => onApply(code.trim())}>
            Apply
          </Button>
        </div>
      )}
      {couponError && (
        <p role="alert" className="text-sm text-red-700">
          {couponError}
        </p>
      )}

      {quote ? (
        <dl
          aria-busy={quoting}
          className={`space-y-2 border-t border-soft pt-3 ${quoting ? "opacity-60" : ""}`}
        >
          <Row label="Subtotal" value={formatBDT(quote.subtotal)} />
          <Row label="Delivery" value={delivery} />
          {quote.discount > 0 && (
            <Row label="Discount" value={`− ${formatBDT(quote.discount)}`} accent />
          )}
          <Row label="Total" value={formatBDT(quote.total)} strong />
        </dl>
      ) : (
        <Skeleton className="h-28" />
      )}
    </div>
  );
}
