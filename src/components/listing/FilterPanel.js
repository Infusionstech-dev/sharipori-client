"use client";

import Link from "next/link";
import clsx from "clsx";
import Checkbox from "@/components/ui/Checkbox";
import { categoryHref } from "@/lib/siteConfig";
import PriceRange from "./PriceRange";

const CHIP_CLASS =
  "flex min-h-11 items-center gap-1.5 rounded-lg border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const chipClass = (selected) =>
  clsx(CHIP_CLASS, selected ? "border-primary bg-soft font-medium text-primary" : "border-text/20 hover:border-primary");

function Section({ title, children }) {
  return (
    <section className="border-b border-soft py-4 first:pt-0 last:border-0">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Count({ value }) {
  return (
    <span className="text-xs font-normal text-text/70">
      <span className="sr-only">, </span>({value})
    </span>
  );
}

export default function FilterPanel({ facets, filters, onChange, subcategories = [], hideFabric }) {
  const toggle = (key, value) => {
    const current = filters[key];
    onChange({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
      page: 1,
    });
  };

  const { fabrics = [], sizes = [], colors = [], priceRange } = facets ?? {};
  const hasPriceRange =
    priceRange && priceRange.min !== null && priceRange.max !== null && priceRange.min < priceRange.max;

  return (
    <div>
      {subcategories.length > 0 && (
        <Section title="Categories">
          <ul>
            {subcategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={categoryHref(category.slug)}
                  className="flex min-h-11 items-center justify-between gap-2 rounded px-1 text-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {category.nameEn}
                  <Count value={category.productCount} />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {!hideFabric && fabrics.length > 0 && (
        <Section title="Fabric">
          <ul>
            {fabrics.map((fabric) => (
              <li key={fabric.slug}>
                <Checkbox
                  checked={filters.fabric.includes(fabric.slug)}
                  onChange={() => toggle("fabric", fabric.slug)}
                  label={
                    <>
                      {fabric.name} <Count value={fabric.count} />
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {sizes.length > 0 && (
        <Section title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const selected = filters.size.includes(String(size.id));
              return (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle("size", String(size.id))}
                  className={chipClass(selected)}
                >
                  {size.label} <Count value={size.count} />
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {colors.length > 0 && (
        <Section title="Colour">
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = filters.color.includes(String(color.id));
              return (
                <button
                  key={color.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle("color", String(color.id))}
                  className={chipClass(selected)}
                >
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: color.hex }}
                    className="size-4 rounded-full ring-1 ring-text/30"
                  />
                  {color.name} <Count value={color.count} />
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {hasPriceRange && (
        <Section title="Price">
          <PriceRange
            key={`${priceRange.min}-${priceRange.max}-${filters.minPrice}-${filters.maxPrice}`}
            range={priceRange}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onCommit={(minPrice, maxPrice) => {
              if (minPrice !== filters.minPrice || maxPrice !== filters.maxPrice) {
                onChange({ ...filters, minPrice, maxPrice, page: 1 });
              }
            }}
          />
        </Section>
      )}

      <Section title="Availability">
        <Checkbox
          checked={filters.inStock}
          onChange={() => onChange({ ...filters, inStock: !filters.inStock, page: 1 })}
          label="In stock only"
        />
      </Section>
    </div>
  );
}
