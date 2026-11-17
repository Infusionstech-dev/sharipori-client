import Badge from "@/components/ui/Badge";
import RemoteImage from "@/components/ui/RemoteImage";
import { formatBDT } from "@/lib/format";

export default function PackageItems({ product }) {
  const { items, separatePrice, savings, savingsPercent, price, salePrice } =
    product;

  return (
    <section
      aria-label="What is in this package"
      className="rounded-lg bg-white p-4 ring-1 ring-soft"
    >
      {/* Closed by default; the button opens the list of items. */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md bg-primary px-4 py-2.5 font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
          <span>
            This package includes ({items.length}{" "}
            {items.length === 1 ? "item" : "items"})
          </span>
          <span
            aria-hidden="true"
            className="transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <ul className="mt-3 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${index}-${item.name}`}
              className="flex items-center gap-3"
            >
              <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-soft">
                {item.image && (
                  <RemoteImage
                    src={item.image}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block font-medium">{item.name}</span>
                <span className="block text-xs text-text/70">
                  {[item.color, item.size].filter(Boolean).join(" / ")}
                  {item.quantity > 1 && ` × ${item.quantity}`}
                </span>
              </span>
              {/* Text items have no price of their own. */}
              {item.unitPrice !== null && (
                <span className="shrink-0 text-sm">
                  {formatBDT(item.unitPrice * item.quantity)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </details>
      <dl className="mt-4 space-y-1 border-t border-soft pt-3 text-sm">
        {separatePrice > 0 && (
          <div className="flex justify-between gap-4">
            <dt>Bought separately</dt>
            <dd>{formatBDT(separatePrice)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4 font-semibold text-primary">
          <dt>Package price</dt>
          <dd>{formatBDT(salePrice ?? price)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex items-center justify-between gap-4">
            <dt>You save</dt>
            <dd>
              <Badge variant="accent">
                {formatBDT(savings)} ({savingsPercent}%)
              </Badge>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
