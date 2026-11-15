import ListingHeader from "@/components/listing/ListingHeader";
import ListingView from "@/components/listing/ListingView";
import Container from "@/components/ui/Container";
import { getInitialListing } from "@/lib/listingServer";

const FIXED = { type: "single" };

export const metadata = {
  title: "All products | Shari Shop",
  description: "Baby and mother traditional clothing at Shari Shop.",
};

export default async function ProductsPage({ searchParams }) {
  const initial = await getInitialListing(searchParams, FIXED);

  return (
    <Container className="py-6">
      <ListingHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "All products" }]}
        title="All products"
        titleBn="সব পণ্য"
      />
      <ListingView fixed={FIXED} initial={initial} />
    </Container>
  );
}
