const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

const effectivePrice = (variant) => variant.salePrice ?? variant.price;

export function buildProductJsonLd(product) {
  const url = `${SITE_URL}/product/${product.slug}`;
  const prices = product.variants.map(effectivePrice);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const availability = `https://schema.org/${product.inStock ? "InStock" : "OutOfStock"}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameEn,
    description: product.seo.description ?? product.shortDesc ?? product.nameEn,
    image: product.images.map((image) => image.url),
    sku: product.variants[0]?.sku,
    offers:
      low === high
        ? { "@type": "Offer", url, priceCurrency: "BDT", price: low, availability }
        : {
            "@type": "AggregateOffer",
            url,
            priceCurrency: "BDT",
            lowPrice: low,
            highPrice: high,
            offerCount: prices.length,
            availability,
          },
  };
}
