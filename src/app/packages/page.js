import ListingHeader from "@/components/listing/ListingHeader";
import ListingView from "@/components/listing/ListingView";
import Container from "@/components/ui/Container";
import { getCategories } from "@/lib/api";
import { getInitialListing } from "@/lib/listingServer";

const FIXED = { type: "bundle" };

export const metadata = {
  title: "Packages | Shari Shop",
  description: "Sonamoni Combo and Maharani Package sets at Shari Shop.",
};

export default async function PackagesPage({ searchParams }) {
  const [initial, categories] = await Promise.all([
    getInitialListing(searchParams, FIXED),
    getCategories(),
  ]);
  const combo = categories.find((category) => category.slug === "combo-packages");

  return (
    <Container className="py-6">
      <ListingHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
        title="Packages"
        titleBn="প্যাকেজ"
      />
      <ListingView
        fixed={FIXED}
        initial={initial}
        subcategories={combo?.children ?? []}
        packages
      />
    </Container>
  );
}
