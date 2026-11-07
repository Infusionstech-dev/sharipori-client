"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import OrderTimeline from "@/components/order/OrderTimeline";
import StatusBadge from "@/components/order/StatusBadge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import RemoteImage from "@/components/ui/RemoteImage";
import Skeleton from "@/components/ui/Skeleton";
import Textarea from "@/components/ui/Textarea";
import useCart from "@/hooks/useCart";
import { serverMessage } from "@/lib/authForms";
import { formatBDT, formatDate } from "@/lib/format";
import { useCancelOrderMutation, useGetMyOrderQuery } from "@/store/api/accountApi";
import { LoadError } from "./States";

const CARD_CLASS = "rounded-lg bg-white p-4 ring-1 ring-soft md:p-5";
const PAYMENT_LABELS = {
  cod: "Cash on delivery",
  bkash: "bKash",
  nagad: "Nagad",
  sslcommerz: "Card",
};

function CancelModal({ orderNo, onClose }) {
  const [reason, setReason] = useState("");
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();

  const confirm = async () => {
    try {
      await cancelOrder({ orderNo, reason: reason.trim() }).unwrap();
      toast.success("Your order has been cancelled");
      onClose();
    } catch (error) {
      toast.error(serverMessage(error, "Could not cancel this order."));
    }
  };

  return (
    <Modal open onClose={onClose} title="Cancel this order?">
      <div className="space-y-4">
        <p className="text-sm">Your items go back on sale and you will not be charged.</p>
        <Textarea
          label="Reason (optional)"
          rows={3}
          maxLength={300}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Keep order
          </Button>
          <Button
            className="flex-1 bg-red-700 hover:bg-red-800"
            loading={isLoading}
            onClick={confirm}
          >
            Cancel order
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Adds each item again at today's price and stock. Items that cannot be added are listed.
function useOrderAgain(order) {
  const router = useRouter();
  const { add } = useCart();
  const [busy, setBusy] = useState(false);

  const orderAgain = async () => {
    setBusy(true);
    const failed = [];
    for (const item of order.items) {
      try {
        await add({
          variantId: item.variantId,
          quantity: item.quantity,
          snapshot: {
            name: item.name,
            image: item.image,
            price: item.unitPrice,
            size: item.size,
            color: item.color,
            slug: null,
          },
        });
      } catch {
        failed.push(item.name);
      }
    }
    setBusy(false);
    if (failed.length === order.items.length) {
      toast.error("None of these items can be ordered right now.");
      return;
    }
    if (failed.length) {
      toast(`Not available any more: ${failed.join(", ")}`);
    }
    router.push("/cart");
  };

  return { orderAgain, busy };
}

function Details({ order }) {
  const [cancelling, setCancelling] = useState(false);
  const { orderAgain, busy } = useOrderAgain(order);
  const { address, totals } = order;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex flex-wrap items-center gap-2 font-display text-2xl text-primary">
            <span className="font-mono">{order.orderNo}</span>
            <StatusBadge status={order.status} />
          </h1>
          <p className="text-sm text-text/70">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {order.canCancel && (
            <Button variant="outline" onClick={() => setCancelling(true)}>
              Cancel order
            </Button>
          )}
          <Button loading={busy} onClick={orderAgain}>
            Order again
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          <section className={CARD_CLASS}>
            <h2 className="mb-3 font-semibold">Items</h2>
            <ul className="divide-y divide-soft">
              {order.items.map((item) => (
                <li key={item.variantId} className="flex items-center gap-3 py-3">
                  <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-soft">
                    {item.image && (
                      <RemoteImage src={item.image} fill sizes="48px" className="object-cover" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-medium">{item.name}</span>
                    <span className="block text-xs text-text/70">
                      {[item.color, item.size].filter(Boolean).join(" / ")}
                      {" · "}
                      {formatBDT(item.unitPrice)} × {item.quantity}
                    </span>
                    {item.bundleItems && (
                      <span className="block text-xs text-text/70">
                        Includes: {item.bundleItems.map((part) => part.name).join(", ")}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-medium">{formatBDT(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-soft pt-3 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatBDT(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>{totals.deliveryCharge ? formatBDT(totals.deliveryCharge) : "Free"}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <dt>Discount{totals.couponCode && ` (${totals.couponCode})`}</dt>
                  <dd>− {formatBDT(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatBDT(totals.total)}</dd>
              </div>
            </dl>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className={CARD_CLASS}>
              <h2 className="mb-2 font-semibold">Delivery address</h2>
              <address className="text-sm not-italic leading-relaxed">
                {address.customerName}
                <br />
                {address.phone}
                <br />
                {address.addressLine}
                <br />
                {address.thana}, {address.district}
                <br />
                <span className="text-text/70">{address.deliveryZone}</span>
              </address>
            </section>
            <section className={CARD_CLASS}>
              <h2 className="mb-2 font-semibold">Payment</h2>
              <p className="text-sm">
                {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </p>
              <p className="text-sm text-text/70">
                {order.paymentStatus === "paid" ? "Paid" : "Pay when it arrives"}
              </p>
              {order.courier && (
                <p className="mt-2 text-sm">
                  {order.courier}
                  {order.trackingNo && ` · ${order.trackingNo}`}
                </p>
              )}
            </section>
          </div>
        </div>

        <section className={`${CARD_CLASS} h-fit`}>
          <h2 className="mb-3 font-semibold">Status</h2>
          <OrderTimeline timeline={order.timeline} />
        </section>
      </div>

      {cancelling && <CancelModal orderNo={order.orderNo} onClose={() => setCancelling(false)} />}
    </div>
  );
}

export default function OrderDetailView({ orderNo }) {
  const { data, isLoading, isError, error, refetch } = useGetMyOrderQuery(orderNo);

  return (
    <div>
      <Link
        href="/account/orders"
        className="mb-3 inline-flex min-h-9 items-center gap-1 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All orders
      </Link>
      {isLoading && <Skeleton className="h-96" />}
      {isError &&
        (error?.status === 404 ? (
          <EmptyState title="Order not found" description="This order is not in your account." />
        ) : (
          <LoadError what="order" onRetry={refetch} />
        ))}
      {data && <Details order={data} />}
    </div>
  );
}
