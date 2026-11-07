"use client";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { formatBDT } from "@/lib/format";
import RadioCard from "./RadioCard";
import Section from "./Section";

const days = (zone) =>
  zone.minDays === zone.maxDays ? `${zone.minDays} days` : `${zone.minDays}-${zone.maxDays} days`;

export default function DeliverySection({
  zones,
  isLoading,
  isError,
  refetch,
  value,
  onChange,
  error,
}) {
  let content;
  if (isLoading) {
    content = <Skeleton className="h-28" />;
  } else if (isError) {
    content = (
      <div className="flex items-center justify-between gap-2 text-sm">
        Could not load delivery options.
        <Button variant="outline" size="sm" onClick={refetch}>
          Try again
        </Button>
      </div>
    );
  } else {
    content = (
      <div role="radiogroup" aria-label="Delivery area" className="space-y-2">
        {zones.map((zone) => (
          <RadioCard
            key={zone.id}
            name="deliveryZoneId"
            value={zone.id}
            checked={value === zone.id}
            onChange={() => onChange(zone.id)}
            title={`${zone.nameEn} (${zone.nameBn})`}
            detail={`Arrives in ${days(zone)}`}
            aside={formatBDT(zone.charge)}
          />
        ))}
      </div>
    );
  }

  return (
    <Section step={3} title="Delivery">
      {content}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </Section>
  );
}
