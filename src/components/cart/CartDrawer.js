"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "@/components/ui/Drawer";
import useCart from "@/hooks/useCart";
import { formatBDT } from "@/lib/format";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import CartLine from "./CartLine";

const LINK_CLASS =
  "flex min-h-11 flex-1 items-center justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.cartDrawerOpen);
  const { items, subtotal, count } = useCart();
  const close = () => dispatch(setCartDrawerOpen(false));

  return (
    <Drawer open={open} onClose={close} title={`Your cart (${count})`}>
      {items.length ? (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-soft">
            {items.map((line) => (
              <CartLine key={line.key} line={line} compact />
            ))}
          </ul>
          <div className="sticky bottom-0 -mx-4 -mb-4 space-y-3 border-t border-soft bg-white p-4">
            <p className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatBDT(subtotal)}</span>
            </p>
            <div className="flex gap-2">
              <Link
                href="/cart"
                onClick={close}
                className={`${LINK_CLASS} border border-primary text-primary hover:bg-soft`}
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={close}
                className={`${LINK_CLASS} bg-primary text-white hover:bg-primary/90`}
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-text/70">Your cart is empty.</p>
      )}
    </Drawer>
  );
}
