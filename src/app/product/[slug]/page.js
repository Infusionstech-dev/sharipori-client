import { cache } from "react";
import { notFound } from "next/navigation";
import PackageItems from "@/components/product/PackageItems";
import ProductDetail from "@/components/product/ProductDetail";
import ProductRow from "@/components/product/ProductRow";
import ProductTabs from "@/components/product/ProductTabs";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Container from "@/components/ui/Container";
import { apiGet, apiGetResponse, getSettings } from "@/lib/api";
import { buildProductJsonLd } from "@/lib/productJsonLd";
import { categoryHref } from "@/lib/siteConfig";

export const revalidate = 120;

const MOTHER_SLUGS = ["mothers-saree", "maharani-package"];

const fetchOptions = { revalidate, tags: ["products"] };

const getProduct = cache(async (slug) => {
  const response = await apiGetResponse(`/products/${encodeURIComponent(slug)}`, fetchOptions);
  if (response?.status === 400 || response?.status === 404) {
    notFound();
  }
  if (!response?.data) {
    // An API outage must not tell customers and search engines the page is gone.
    throw new Error("Could not load the product");
  }
  return response.data;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const title = product.seo.title ?? `${product.nameEn} | Shari Shop`;
  const description = product.seo.description ?? product.shortDesc ?? product.nameEn;
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params, searchParams }) {
  const { slug } = await params;
  const { v } = await searchParams;
  const [product, matches, related, settings] = await Promise.all([
    getProduct(slug),
    apiGet(`/products/${encodeURIComponent(slug)}/match`, fetchOptions),
    apiGet(`/products/${encodeURIComponent(slug)}/related`, fetchOptions),
    getSettings(),
  ]);

  const isForMother = product.breadcrumb.some((crumb) => MOTHER_SLUGS.includes(crumb.slug));
  const crumbs = [
    { label: "Home", href: "/" },
    ...product.breadcrumb.map((crumb) => ({
      label: crumb.nameEn,
      href: categoryHref(crumb.slug),
    })),
    { label: product.nameEn },
  ];

  return (
    <Container className="py-6">
      <script
        type="application/ld+json"
        // "<" is escaped so product text can never close this script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductJsonLd(product)).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumb crumbs={crumbs} />
      <ProductDetail
        product={product}
        requestedVariantId={Number(v)}
        whatsappNumber={settings.whatsappNumber}
        packageItems={product.type === "bundle" ? <PackageItems product={product} /> : null}
      />
      <ProductTabs
        product={product}
        deliveryInfoText={settings.deliveryInfoText}
        returnPolicyText={settings.returnPolicyText}
      />
      <ProductRow
        title={isForMother ? "Match with Baby" : "Match with Mom"}
        products={matches ?? []}
      />
      <ProductRow title="You may also like" products={related ?? []} />
    </Container>
  );
}
