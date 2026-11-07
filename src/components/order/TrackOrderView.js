"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/format";
import { useTrackOrderQuery } from "@/store/api/checkoutApi";
import OrderTimeline from "./OrderTimeline";
import StatusBadge from "./StatusBadge";

const schema = z.object({
  orderNo: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^SS-\d{8}-\d{4,}$/, "Enter an order number like SS-20261107-0001"),
  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Enter the phone number used for the order"),
});

function Result({ lookup }) {
  const { data, isFetching, isError, error } = useTrackOrderQuery(lookup);

  if (isFetching) {
    return <Skeleton className="h-60" />;
  }
  if (isError) {
    return (
      <p role="alert" className="rounded-lg bg-soft p-4 text-sm text-primary">
        {error?.status === 404
          ? "We could not find an order with this number and phone. Please check both and try again."
          : error?.status === 429
            ? "Too many tries. Please wait a few minutes and try again."
            : "Could not check your order just now. Please try again."}
      </p>
    );
  }
  return (
    <section aria-live="polite" className="space-y-4 rounded-lg bg-white p-5 ring-1 ring-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono font-semibold">{data.orderNo}</p>
        <StatusBadge status={data.status} />
      </div>
      <p className="text-sm text-text/70">Placed on {formatDate(data.createdAt)}</p>
      {data.courier ? (
        <p className="rounded-lg bg-soft p-3 text-sm">
          Sent with <strong>{data.courier}</strong>
          {data.trackingNo && (
            <>
              , tracking number <strong className="font-mono">{data.trackingNo}</strong>
            </>
          )}
        </p>
      ) : (
        <p className="text-sm text-text/70">Courier details appear here once your order ships.</p>
      )}
      <OrderTimeline timeline={data.timeline} />
    </section>
  );
}

export default function TrackOrderView() {
  const searchParams = useSearchParams();
  const [lookup, setLookup] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { orderNo: searchParams.get("orderNo") ?? "", phone: "" },
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <form
        noValidate
        onSubmit={handleSubmit(setLookup)}
        className="space-y-4 rounded-lg bg-white p-5 ring-1 ring-soft"
      >
        <Input
          label="Order number"
          placeholder="SS-20261107-0001"
          autoCapitalize="characters"
          error={errors.orderNo?.message}
          {...register("orderNo")}
        />
        <Input
          label="Phone number"
          type="tel"
          inputMode="numeric"
          placeholder="01XXXXXXXXX"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Button type="submit" size="lg" className="w-full">
          Track order
        </Button>
      </form>
      {lookup && <Result lookup={lookup} />}
    </div>
  );
}
