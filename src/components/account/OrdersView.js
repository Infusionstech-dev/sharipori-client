"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/order/StatusBadge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import RemoteImage from "@/components/ui/RemoteImage";
import Skeleton from "@/components/ui/Skeleton";
import { formatBDT, formatDate } from "@/lib/format";
import { useGetMyOrdersQuery } from "@/store/api/accountApi";
import { LoadError, PageTitle } from "./States";

const PAGE_SIZE = 10;

export default function OrdersView() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useGetMyOrdersQuery({
    page,
    limit: PAGE_SIZE,
  });

  let content;
  if (isLoading) {
    content = (
      <div className="space-y-3" role="status" aria-label="Loading orders">
        {[1, 2, 3].map((row) => (
          <Skeleton key={row} className="h-24" />
        ))}
      </div>
    );
  } else if (isError) {
    content = <LoadError what="orders" onRetry={refetch} />;
  } else if (!data.data.length) {
    content = (
      <EmptyState
        title="No orders yet"
        description="When you place an order it will show up here."
        action={
          <Link
            href="/"
            className="flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white"
          >
            Start shopping
          </Link>
        }
      />
    );
  } else {
    const { totalPages } = data.meta;
    content = (
      <>
        <ul aria-busy={isFetching} className="space-y-3">
          {data.data.map((order) => (
            <li key={order.orderNo}>
              <Link
                href={`/account/orders/${order.orderNo}`}
                className="flex items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-soft hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="relative h-18 w-14 shrink-0 overflow-hidden rounded bg-soft">
                  {order.firstItemImage && (
                    <RemoteImage
                      src={order.firstItemImage}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{order.orderNo}</span>
                    <StatusBadge status={order.status} />
                  </span>
                  <span className="block text-xs text-text/70">
                    {formatDate(order.createdAt)} · {order.itemCount}{" "}
                    {order.itemCount === 1 ? "item" : "items"}
                  </span>
                  <span className="block text-sm font-semibold">{formatBDT(order.total)}</span>
                </span>
                <span className="shrink-0 text-sm font-medium text-primary">View</span>
              </Link>
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Newer
            </Button>
            <span className="text-sm text-text/70">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Older
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <PageTitle>My orders</PageTitle>
      {content}
    </div>
  );
}
