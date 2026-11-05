import Link from "next/link";
import Badge from "@/components/ui/Badge";
import PriceTag from "@/components/ui/PriceTag";
import RemoteImage from "@/components/ui/RemoteImage";
import AddToCartButton from "./AddToCartButton";

const IMAGE_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";
const MAX_COLORS = 5;

export default function ProductCard({ product }) {
  const { nameEn, nameBn, slug, image, hoverImage, fabric, price, salePrice } = product;
  const { discountPercent, inStock, colors, isNew } = product;

  return (
    <article className="group relative flex h-full flex-col rounded-lg bg-white p-2 ring-1 ring-soft transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] overflow-hidden rounded bg-soft">
        {image && (
          <RemoteImage src={image} fill sizes={IMAGE_SIZES} className="object-cover" />
        )}
        {/* display:none keeps phones from downloading an image they can never hover to see. */}
        {hoverImage && (
          <RemoteImage
            src={hoverImage}
            fill
            sizes={IMAGE_SIZES}
            className="hidden object-cover opacity-0 transition-opacity group-hover:opacity-100 md:block"
          />
        )}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {isNew && <Badge variant="primary">New</Badge>}
          {discountPercent > 0 && <Badge variant="accent">-{discountPercent}%</Badge>}
        </div>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Badge variant="neutral">Out of stock</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-2">
        {fabric && <span className="mb-1 text-xs text-text/70">{fabric.nameEn}</span>}
        <h3 className="line-clamp-2 text-sm font-medium">
          {/* The stretched link makes the whole card clickable without nesting the button in it. */}
          <Link
            href={`/product/${slug}`}
            className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
          >
            {nameEn}
          </Link>
        </h3>
        {nameBn && <p className="truncate font-bangla text-xs text-text/70">{nameBn}</p>}
        <div className="mt-1 flex-1">
          <PriceTag price={price} salePrice={salePrice} showBadge={false} />
        </div>
        {colors.length > 0 && (
          <ul aria-label="Colours" className="mt-1 flex items-center gap-1">
            {colors.slice(0, MAX_COLORS).map((color) => (
              <li
                key={color.id}
                title={color.name}
                style={{ backgroundColor: color.hex }}
                className="size-3.5 rounded-full ring-1 ring-text/20"
              >
                <span className="sr-only">{color.name}</span>
              </li>
            ))}
            {colors.length > MAX_COLORS && (
              <li className="text-xs text-text/70">+{colors.length - MAX_COLORS}</li>
            )}
          </ul>
        )}
        <AddToCartButton name={nameEn} disabled={!inStock} />
      </div>
    </article>
  );
}
