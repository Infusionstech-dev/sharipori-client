"use client";

import { X } from "lucide-react";
import { clearedFilters, countActiveFilters } from "@/lib/listing";
import { formatBDT } from "@/lib/format";

const priceLabel = ({ minPrice, maxPrice }) => {
  if (minPrice !== null && maxPrice !== null) {
    return `${formatBDT(minPrice)} – ${formatBDT(maxPrice)}`;
  }
  return minPrice !== null ? `From ${formatBDT(minPrice)}` : `Up to ${formatBDT(maxPrice)}`;
};

export default function ActiveFilters({ facets, filters, onChange }) {
  if (!countActiveFilters(filters)) {
    return null;
  }

  const without = (key, value) => ({
    ...filters,
    [key]: filters[key].filter((item) => item !== value),
    page: 1,
  });
  const nameOf = (list, match, field) => list?.find(match)?.[field];

  const chips = [
    ...filters.fabric.map((slug) => ({
      key: `fabric-${slug}`,
      label: nameOf(facets?.fabrics, (item) => item.slug === slug, "name") ?? slug,
      next: without("fabric", slug),
    })),
    ...filters.size.map((id) => ({
      key: `size-${id}`,
      label: `Size ${nameOf(facets?.sizes, (item) => String(item.id) === id, "label") ?? id}`,
      next: without("size", id),
    })),
    ...filters.color.map((id) => ({
      key: `color-${id}`,
      label: nameOf(facets?.colors, (item) => String(item.id) === id, "name") ?? `Colour ${id}`,
      next: without("color", id),
    })),
  ];
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      key: "price",
      label: priceLabel(filters),
      next: { ...filters, minPrice: null, maxPrice: null, page: 1 },
    });
  }
  if (filters.inStock) {
    chips.push({
      key: "stock",
      label: "In stock",
      next: { ...filters, inStock: false, page: 1 },
    });
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          aria-label={`Remove filter: ${chip.label}`}
          onClick={() => onChange(chip.next)}
          className="flex min-h-9 items-center gap-1 rounded-full bg-soft px-3 text-sm text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {chip.label}
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(clearedFilters(filters))}
        className="min-h-9 rounded px-2 text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Clear all
      </button>
    </div>
  );
}
