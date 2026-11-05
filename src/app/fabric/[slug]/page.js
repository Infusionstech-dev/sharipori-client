import ListingHeader from "@/components/listing/ListingHeader";
import ListingView from "@/components/listing/ListingView";
import Container from "@/components/ui/Container";
import { getFabricOrNotFound, getInitialListing } from "@/lib/listingServer";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fabric = await getFabricOrNotFound(slug);
  return {
    title: `${fabric.nameEn} | Shari Shop`,
    description: `Shop ${fabric.nameEn} (${fabric.nameBn}) clothing at Shari Shop.`,
  };
}

export default async function FabricPage({ params, searchParams }) {
  const { slug } = await params;
  const fabric = await getFabricOrNotFound(slug);
  const fixed = { fabric: slug };
  const initial = await getInitialListing(searchParams, fixed);

  return (
    <Container className="py-6">
      <ListingHeader
        crumbs={[{ label: "Home", href: "/" }, { label: fabric.nameEn }]}
        title={fabric.nameEn}
        titleBn={fabric.nameBn}
      />
      <ListingView key={slug} fixed={fixed} initial={initial} />
    </Container>
  );
}
