import Link from "next/link";
import PriceTag from "@/components/ui/PriceTag";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { fabricHref } from "@/lib/siteConfig";

const LOW_STOCK = 3;

const stockText = (variant, product) => {
  if (!variant || !product.inStock) {
    return "Out of stock";
  }
  return variant.availableQty <= LOW_STOCK ? `Only ${variant.availableQty} left` : "In stock";
};

export default function ProductInfo({ product, variant }) {
  const { nameEn, nameBn, fabric, shortDesc } = product;
  const low = variant && variant.availableQty <= LOW_STOCK;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-3xl text-primary">{nameEn}</h1>
        <WishlistButton
          productId={product.id}
          name={nameEn}
          className="relative shrink-0 border border-soft"
        />
      </div>
      {nameBn && <p className="font-bangla text-text/70">{nameBn}</p>}
      {fabric && (
        <Link
          href={fabricHref(fabric.slug)}
          className="inline-flex min-h-8 items-center rounded-full bg-soft px-3 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {fabric.nameEn}
        </Link>
      )}
      <PriceTag
        price={variant?.price ?? product.price}
        salePrice={variant ? variant.salePrice : product.salePrice}
      />
      <p className={low ? "text-sm font-medium text-red-700" : "text-sm text-text/70"}>
        {stockText(variant, product)}
        {variant?.sku && <span className="font-normal text-text/70"> · SKU {variant.sku}</span>}
      </p>
      {shortDesc && <p className="text-sm text-text/80">{shortDesc}</p>}
    </div>
  );
}
