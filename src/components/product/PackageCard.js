import Link from "next/link";
import Badge from "@/components/ui/Badge";
import RemoteImage from "@/components/ui/RemoteImage";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { formatBDT } from "@/lib/format";

export default function PackageCard({ product, label }) {
  const { nameEn, nameBn, slug, image, price, salePrice, inStock, bundle } = product;
  const itemCount = bundle?.itemCount ?? 0;
  const savings = bundle?.savings ?? 0;

  return (
    <article className="relative grid overflow-hidden rounded-lg bg-white ring-1 ring-soft transition-shadow hover:shadow-md sm:grid-cols-2">
      <div className="relative aspect-[4/3] bg-soft sm:aspect-auto sm:min-h-72">
        {image && (
          <RemoteImage
            src={image}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <WishlistButton
          productId={product.id}
          name={nameEn}
          className="absolute right-3 top-3"
        />
        {savings > 0 && (
          <Badge variant="accent" className="absolute left-3 top-3">
            Save {formatBDT(savings)}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-2 p-5">
        {label && <p className="text-xs font-semibold uppercase text-primary">{label}</p>}
        <h3 className="font-display text-xl">{nameEn}</h3>
        {nameBn && <p className="font-bangla text-sm text-text/70">{nameBn}</p>}
        {itemCount > 0 && <p className="text-sm">Includes {itemCount} items</p>}
        <p className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
          <span className="text-xl font-semibold text-primary">
            {formatBDT(salePrice ?? price)}
          </span>
          {savings > 0 && (
            <del className="text-sm text-text/70">
              <span className="sr-only">Bought separately </span>
              {formatBDT(bundle.separatePrice)}
            </del>
          )}
        </p>
        {!inStock && <p className="text-sm text-text/70">Out of stock</p>}
        <Link
          href={`/product/${slug}`}
          aria-label={`View package: ${nameEn}`}
          className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white after:absolute after:inset-0 hover:bg-primary/90 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-primary"
        >
          View package
        </Link>
      </div>
    </article>
  );
}
