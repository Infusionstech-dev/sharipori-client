"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  useAddItemMutation,
  useGetCartQuery,
  useRemoveItemMutation,
  useUpdateItemMutation,
} from "@/store/api/cartApi";
import { MAX_LINE_QTY, add, remove, update } from "@/store/slices/cartSlice";

const round = (value) => Math.round(value * 100) / 100;

export const BLOCKING_STATUSES = ["out_of_stock", "unavailable"];

// One line shape for both carts. price is what one unit costs now; regularPrice is set when on sale.
const fromServer = (line) => ({
  key: `i${line.id}`,
  id: line.id,
  variantId: line.variantId,
  slug: line.slug,
  name: line.name,
  nameBn: line.nameBn,
  image: line.image,
  size: line.size,
  color: line.color,
  price: line.salePrice ?? line.unitPrice,
  regularPrice: line.salePrice !== null ? line.unitPrice : null,
  quantity: line.quantity,
  maxQty: Math.max(1, line.availableQty),
  lineTotal: line.lineTotal,
  status: line.status,
});

const fromGuest = (item) => ({
  key: `v${item.variantId}`,
  variantId: item.variantId,
  slug: item.snapshot.slug,
  name: item.snapshot.name,
  image: item.snapshot.image,
  size: item.snapshot.size,
  color: item.snapshot.color,
  price: item.snapshot.price,
  regularPrice: null,
  quantity: item.quantity,
  maxQty: Math.max(1, Math.min(item.snapshot.availableQty ?? MAX_LINE_QTY, MAX_LINE_QTY)),
  lineTotal: round(item.snapshot.price * item.quantity),
  status: "ok",
});

// The one cart interface for components. Logged in: the server cart. Guest: the local cart.
export default function useCart() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const guest = useSelector((state) => state.cart);
  const loggedIn = authStatus === "authenticated";
  // Until the session check ends it is unknown which cart is the real one.
  const deciding = authStatus === "idle" || authStatus === "checking" || !guest.hydrated;

  const server = useGetCartQuery(undefined, { skip: !loggedIn });
  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [removeItem] = useRemoveItemMutation();

  let items = [];
  if (loggedIn) {
    items = (server.data?.items ?? []).map(fromServer);
  } else if (!deciding) {
    items = guest.items.map(fromGuest);
  }

  // Resolves when added. Throws the API error for logged-in customers, so callers can show it.
  const addToCart = async ({ variantId, quantity, snapshot }) => {
    if (loggedIn) {
      await addItem({ variantId, quantity }).unwrap();
    } else {
      dispatch(add({ variantId, quantity, snapshot }));
    }
  };

  const changeQuantity = (line, quantity) =>
    loggedIn
      ? updateItem({ id: line.id, quantity }).unwrap()
      : dispatch(update({ variantId: line.variantId, quantity }));

  const removeLine = (line) =>
    loggedIn ? removeItem(line.id).unwrap() : dispatch(remove(line.variantId));

  return {
    items,
    loggedIn,
    subtotal: round(items.reduce((total, line) => total + line.lineTotal, 0)),
    count: items.reduce((total, line) => total + line.quantity, 0),
    hasBlockingIssues: items.some((line) => BLOCKING_STATUSES.includes(line.status)),
    add: addToCart,
    update: changeQuantity,
    remove: removeLine,
    isLoading: deciding || (loggedIn && server.isLoading),
    // Just after login the saved guest items are still moving into the customer's cart, and the
    // server cart looks empty until that is done.
    mergePending: loggedIn && guest.items.length > 0 && !guest.mergeFailed,
    isError: loggedIn && server.isError,
    refetch: server.refetch,
  };
}
