"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import QuantityStepper from "@/components/product/QuantityStepper";
import Badge from "@/components/ui/Badge";
import RemoteImage from "@/components/ui/RemoteImage";
import { formatBDT } from "@/lib/format";

export const ISSUES = {
  price_changed: {
    label: "Price changed",
    text: "The price has changed since you added this item. The new price is shown.",
  },
  qty_reduced: {
    label: "Quantity reduced",
    text: "Only this many are available now, so we lowered the quantity.",
  },
  out_of_stock: {
    label: "Out of stock",
    text: "This item has sold out. Remove it to continue to checkout.",
  },
  unavailable: {
    label: "Unavailable",
    text: "This item is no longer sold. Remove it to continue to checkout.",
  },
};

const BLOCKING = ["out_of_stock", "unavailable"];

// compact is the drawer version: no stepper, no explanations.
export default function CartLine({ line, notice, onQuantity, onRemove, compact = false }) {
  const issue = ISSUES[notice ?? line.status];
  const blocked = BLOCKING.includes(line.status);
  const variant = [line.color, line.size].filter(Boolean).join(" / ");
  const href = line.slug ? `/product/${line.slug}` : null;

  return (
    <li className={clsx("flex gap-3 py-4", blocked && "opacity-80")}>
      <span className="relative h-24 w-18 shrink-0 overflow-hidden rounded bg-soft">
        {line.image && <RemoteImage src={line.image} fill sizes="72px" className="object-cover" />}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {href ? (
              <Link href={href} className="line-clamp-2 text-sm font-medium hover:text-primary">
                {line.name}
              </Link>
            ) : (
              <span className="text-sm font-medium">{line.name ?? "Item no longer available"}</span>
            )}
            {variant && <p className="text-xs text-text/70">{variant}</p>}
          </div>
          {!compact && (
            <button
              type="button"
              aria-label={`Remove ${line.name ?? "item"}`}
              onClick={() => onRemove(line)}
              className="flex size-11 shrink-0 items-center justify-center rounded-lg text-text/70 hover:bg-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {issue && (
          <div className="space-y-0.5">
            <Badge variant={blocked ? "neutral" : "accent"}>{issue.label}</Badge>
            {!compact && <p className="text-xs text-text/70">{issue.text}</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm">
            {line.price !== null && formatBDT(line.price)}
            {line.regularPrice && (
              <del className="ml-1 text-xs text-text/70">
                <span className="sr-only">Regular price </span>
                {formatBDT(line.regularPrice)}
              </del>
            )}
            {compact && <span className="text-text/70"> × {line.quantity}</span>}
          </p>
          {!compact && !blocked && (
            <QuantityStepper
              value={line.quantity}
              max={line.maxQty}
              onChange={(quantity) => onQuantity(line, quantity)}
            />
          )}
          <p className="text-sm font-semibold">{blocked ? "—" : formatBDT(line.lineTotal)}</p>
        </div>
      </div>
    </li>
  );
}
