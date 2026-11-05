import clsx from "clsx";
import { formatBDT } from "@/lib/format";
import Badge from "./Badge";

export default function PriceTag({ price, salePrice, showBadge = true, className }) {
  const regular = Number(price);
  const sale = Number(salePrice);
  const onSale = salePrice != null && sale >= 0 && sale < regular;

  return (
    <div className={clsx("flex flex-wrap items-center gap-2", className)}>
      <span className="text-lg font-semibold text-primary">
        {formatBDT(onSale ? sale : regular)}
      </span>
      {onSale && (
        <>
          <del className="text-sm text-text/70">
            <span className="sr-only">Regular price </span>
            {formatBDT(regular)}
          </del>
          {showBadge && (
            <Badge variant="accent">{Math.round(((regular - sale) / regular) * 100)}% off</Badge>
          )}
        </>
      )}
    </div>
  );
}
