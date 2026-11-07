"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import useCart, { BLOCKING_STATUSES } from "@/hooks/useCart";
import { serverMessage } from "@/lib/authForms";
import { formatBDT } from "@/lib/format";
import { useValidateCartQuery } from "@/store/api/cartApi";
import { syncFromServer } from "@/store/slices/cartSlice";
import CartLine from "./CartLine";

const NOTICE_STATUSES = ["price_changed", "qty_reduced"];

function LoadingLines() {
  return (
    <div className="space-y-4" aria-label="Loading your cart" role="status">
      {[1, 2, 3].map((row) => (
        <div key={row} className="flex gap-3">
          <Skeleton className="h-24 w-18" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Guests' carts live in the browser, so the server checks them on this page.
// Price and quantity changes are applied straight away and explained once.
function useGuestCheck(cart) {
  const dispatch = useDispatch();
  const guestItems = useSelector((state) => state.cart.items);
  const request = guestItems.map(({ variantId, quantity, snapshot }) => ({
    variantId,
    quantity,
    price: snapshot.price,
  }));
  const { data, isError } = useValidateCartQuery(request, {
    skip: cart.loggedIn || cart.isLoading || !request.length,
  });

  const [notices, setNotices] = useState({});
  const [seen, setSeen] = useState(null);
  if (data && data !== seen) {
    setSeen(data);
    const fresh = Object.fromEntries(
      data.items
        .filter((line) => NOTICE_STATUSES.includes(line.status))
        .map((line) => [line.variantId, line.status])
    );
    if (Object.keys(fresh).length) {
      setNotices((current) => ({ ...current, ...fresh }));
    }
  }

  useEffect(() => {
    if (data?.items.some((line) => NOTICE_STATUSES.includes(line.status))) {
      dispatch(syncFromServer(data.items));
    }
  }, [data, dispatch]);

  if (cart.loggedIn || !data) {
    return {
      items: cart.items,
      notices: {},
      checkFailed: !cart.loggedIn && isError,
    };
  }
  const statuses = new Map(data.items.map((line) => [line.variantId, line]));
  return {
    items: cart.items.map((line) => {
      const checked = statuses.get(line.variantId);
      if (!checked || !BLOCKING_STATUSES.includes(checked.status)) {
        return line;
      }
      return { ...line, status: checked.status, lineTotal: 0 };
    }),
    notices,
    checkFailed: false,
  };
}

export default function CartView() {
  const cart = useCart();
  const { items, notices, checkFailed } = useGuestCheck(cart);

  const subtotal = items.reduce((total, line) => total + line.lineTotal, 0);
  const blocked = items.some((line) => BLOCKING_STATUSES.includes(line.status));

  const run = (action) =>
    Promise.resolve(action).catch((error) =>
      toast.error(serverMessage(error, "Could not update your cart. Please try again."))
    );

  if (cart.isLoading) {
    return <LoadingLines />;
  }
  if (cart.isError) {
    return (
      <EmptyState
        title="Could not load your cart"
        description="Please check your connection and try again."
        action={
          <Button variant="outline" onClick={cart.refetch}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Find something you love and add it here."
        action={
          <Link
            href="/"
            className="flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Continue shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="divide-y divide-soft rounded-lg bg-white px-4 ring-1 ring-soft">
        {items.map((line) => (
          <CartLine
            key={line.key}
            line={line}
            notice={BLOCKING_STATUSES.includes(line.status) ? null : notices[line.variantId]}
            onQuantity={(item, quantity) => run(cart.update(item, quantity))}
            onRemove={(item) => run(cart.remove(item))}
          />
        ))}
      </ul>

      <aside
        aria-label="Order summary"
        className="h-fit space-y-3 rounded-lg bg-white p-5 ring-1 ring-soft lg:sticky lg:top-20"
      >
        <h2 className="font-display text-xl text-primary">Order summary</h2>
        <p className="flex justify-between text-sm">
          <span>Subtotal ({cart.count} items)</span>
          <span className="font-semibold">{formatBDT(subtotal)}</span>
        </p>
        <p className="flex justify-between text-sm text-text/70">
          <span>Delivery</span>
          <span>Calculated at checkout</span>
        </p>
        {blocked && (
          <p role="alert" className="rounded-lg bg-soft p-3 text-sm text-primary">
            Some items are out of stock or no longer sold. Remove them to continue.
          </p>
        )}
        {checkFailed && (
          <p className="text-sm text-text/70">
            We could not check prices and stock just now. They will be checked again at checkout.
          </p>
        )}
        {blocked ? (
          <Button size="lg" disabled className="w-full">
            Checkout
          </Button>
        ) : (
          <Link
            href="/checkout"
            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Checkout
          </Link>
        )}
        <Link
          href="/"
          className="block text-center text-sm text-primary underline underline-offset-4"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
