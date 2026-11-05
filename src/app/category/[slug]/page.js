import Container from "@/components/ui/Container";
import ListingHeader from "@/components/listing/ListingHeader";
import ListingView from "@/components/listing/ListingView";
import { getCategoryOrNotFound, getInitialListing } from "@/lib/listingServer";
import { categoryHref } from "@/lib/siteConfig";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryOrNotFound(slug);
  return {
    title: `${category.nameEn} | Shari Shop`,
    description: `Shop ${category.nameEn} (${category.nameBn}) at Shari Shop.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const category = await getCategoryOrNotFound(slug);
  const fixed = { category: slug };
  const initial = await getInitialListing(searchParams, fixed);

  const crumbs = [
    { label: "Home", href: "/" },
    ...category.breadcrumb.map((item, index, all) => ({
      label: item.nameEn,
      href: index < all.length - 1 ? categoryHref(item.slug) : undefined,
    })),
  ];

  return (
    <Container className="py-6">
      <ListingHeader
        crumbs={crumbs}
        title={category.nameEn}
        titleBn={category.nameBn}
        image={category.image}
      />
      <ListingView
        key={slug}
        fixed={fixed}
        initial={initial}
        subcategories={category.children}
      />
    </Container>
  );
}
