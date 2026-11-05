import Badge from "@/components/ui/Badge";
import RemoteImage from "@/components/ui/RemoteImage";
import { formatBDT } from "@/lib/format";

export default function PackageItems({ product }) {
  const { items, separatePrice, savings, savingsPercent, price, salePrice } = product;

  return (
    <section aria-label="What is in this package" className="rounded-lg bg-white p-4 ring-1 ring-soft">
      <h2 className="mb-3 font-semibold">This package includes</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={`${item.name}-${item.size}-${item.color}`} className="flex items-center gap-3">
            <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-soft">
              {item.image && (
                <RemoteImage src={item.image} fill sizes="48px" className="object-cover" />
              )}
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="block font-medium">{item.name}</span>
              <span className="block text-xs text-text/70">
                {[item.color, item.size].filter(Boolean).join(" / ")}
                {item.quantity > 1 && ` × ${item.quantity}`}
              </span>
            </span>
            <span className="shrink-0 text-sm">{formatBDT(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1 border-t border-soft pt-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt>Bought separately</dt>
          <dd>{formatBDT(separatePrice)}</dd>
        </div>
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
