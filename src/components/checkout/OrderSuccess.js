"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import RemoteImage from "@/components/ui/RemoteImage";
import { formatBDT } from "@/lib/format";
import { firstTimeFor, loadLastOrder } from "@/lib/lastOrder";
import { useTrackOrderQuery } from "@/store/api/checkoutApi";

const STATUS_LABELS = {
  pending: "Order placed",
  confirmed: "Confirmed",
  processing: "Being prepared",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Dhaka",
});

export default function OrderSuccess({ orderNo }) {
  // Read after mounting: the copy lives in this browser tab only.
  const [order, setOrder] = useState(undefined);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable here
    setOrder(loadLastOrder(orderNo));
  }, [orderNo]);

  const tracking = useTrackOrderQuery({ orderNo, phone: order?.phone }, { skip: !order?.phone });

  // A Facebook pixel loaded on the site gets one Purchase per order, even after a reload.
  useEffect(() => {
    if (order && typeof window.fbq === "function" && firstTimeFor(orderNo, "pixel")) {
      window.fbq("track", "Purchase", { value: order.total, currency: "BDT" });
    }
  }, [order, orderNo]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(orderNo);
      toast.success("Order number copied");
    } catch {
      toast.error("Could not copy. Please note it down.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-green-700" aria-hidden="true" />
        <h1 className="mt-3 font-display text-3xl text-primary">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-text/80">
          We will call you soon to confirm it. Please keep your phone nearby.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 ring-1 ring-soft">
          <span className="text-sm text-text/70">Order number</span>
          <strong className="font-mono">{orderNo}</strong>
          <button
            type="button"
            aria-label="Copy order number"
            onClick={copy}
            className="flex size-9 items-center justify-center rounded hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Copy className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {order && (
        <section className="rounded-lg bg-white p-5 ring-1 ring-soft">
          <h2 className="mb-3 font-semibold">Order summary</h2>
          <ul className="space-y-3">
            {order.lines.map((line) => (
              <li
                key={`${line.name}-${line.size}-${line.color}`}
                className="flex items-center gap-3 text-sm"
              >
                <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded bg-soft">
                  {line.image && (
                    <RemoteImage src={line.image} fill sizes="44px" className="object-cover" />
                  )}
                </span>
                <span className="flex-1">
                  {line.name} × {line.quantity}
                  <span className="block text-xs text-text/70">
                    {[line.color, line.size].filter(Boolean).join(" / ")}
                  </span>
                </span>
                <span>{formatBDT(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-soft pt-3 text-sm">
            {order.subtotal !== undefined && (
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatBDT(order.subtotal)}</dd>
              </div>
            )}
            {order.deliveryCharge !== undefined && (
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>{order.deliveryCharge ? formatBDT(order.deliveryCharge) : "Free"}</dd>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <dt>Discount</dt>
                <dd>− {formatBDT(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold">
              <dt>Total (cash on delivery)</dt>
              <dd>{formatBDT(order.total)}</dd>
            </div>
          </dl>
        </section>
      )}

      {tracking.data && (
        <section className="rounded-lg bg-white p-5 ring-1 ring-soft">
          <h2 className="mb-3 font-semibold">Status</h2>
          <ol className="space-y-2 border-l-2 border-primary/30 pl-4 text-sm">
            {tracking.data.timeline.map((step) => (
              <li key={`${step.status}-${step.at}`}>
                <span className="font-medium">{STATUS_LABELS[step.status] ?? step.status}</span>
                <span className="block text-xs text-text/70">
                  {timeFormat.format(new Date(step.at))}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/track-order?orderNo=${orderNo}`}
          className="flex min-h-12 flex-1 items-center justify-center rounded-lg border border-primary text-sm font-medium text-primary hover:bg-soft"
        >
          Track order
        </Link>
        <Link
          href="/"
          className="flex min-h-12 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary/90"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
