"use client";

import { SORT_OPTIONS } from "@/lib/listing";

export default function SortSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden sm:inline">Sort by</span>
      <select
        aria-label="Sort by"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-lg border border-text/25 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
