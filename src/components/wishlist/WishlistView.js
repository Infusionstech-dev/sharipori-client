"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import useMounted from "@/hooks/useMounted";
import ProductGrid from "@/components/listing/ProductGrid";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useGetProductsQuery } from "@/store/api/productApi";
import { clear, remove } from "@/store/slices/wishlistSlice";

function SavedProducts({ savedIds }) {
  const dispatch = useDispatch();
  const ids = useSelector((state) => state.wishlist.ids);
  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    ids: savedIds.join(","),
    limit: savedIds.length,
  });

  if (isError) {
    return (
      <EmptyState
        title="We could not load your wishlist"
        description="Please check your connection and try again."
        action={<Button onClick={refetch}>Try again</Button>}
      />
    );
  }
  if (isLoading) {
    return <ProductGrid products={[]} isLoading />;
  }

  // Newest saved first. A heart removed on this page leaves at once, without loading again.
  const byId = new Map(data.data.map((product) => [product.id, product]));
  const products = ids.map((id) => byId.get(id)).filter(Boolean);
  const gone = savedIds.filter((id) => !byId.has(id) && ids.includes(id));

  if (!products.length && !gone.length) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here."
        action={
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-text/70">
          {products.length} saved item{products.length === 1 ? "" : "s"}
        </p>
        <Button variant="ghost" size="sm" onClick={() => dispatch(clear())}>
          Clear wishlist
        </Button>
      </div>
      {gone.length > 0 && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-soft/60 p-3 text-sm"
        >
          <span>
            {gone.length} saved item{gone.length === 1 ? " is" : "s are"} no longer sold.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => gone.forEach((id) => dispatch(remove(id)))}
          >
            Remove {gone.length === 1 ? "it" : "them"}
          </Button>
        </div>
      )}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WishlistView() {
  const { ids, hydrated: loaded } = useSelector((state) => state.wishlist);
  const hydrated = useMounted() && loaded;
  // The products are loaded once for the list as it was when the page opened.
  const [openedWith, setOpenedWith] = useState(null);

  if (hydrated && openedWith === null) {
    setOpenedWith(ids);
  }

  if (!hydrated || openedWith === null) {
    return <ProductGrid products={[]} isLoading />;
  }
  if (!openedWith.length && !ids.length) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here."
        action={
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
        }
      />
    );
  }
  if (!openedWith.length) {
    // Saved in another tab after this page opened.
    return <SavedProducts key={ids.join(",")} savedIds={ids} />;
  }
  return <SavedProducts savedIds={openedWith} />;
}
