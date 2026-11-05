import { redirect } from "next/navigation";
import ListingHeader from "@/components/listing/ListingHeader";
import ListingView from "@/components/listing/ListingView";
import NoResults from "@/components/listing/NoResults";
import Container from "@/components/ui/Container";
import { apiGet, getCategories } from "@/lib/api";
import { getInitialListing } from "@/lib/listingServer";
import { cleanQuery } from "@/lib/search";

const queryFrom = async (searchParams) => {
  const { q } = await searchParams;
  return cleanQuery(Array.isArray(q) ? q[0] : q);
};

export async function generateMetadata({ searchParams }) {
  return {
    title: `Search: ${await queryFrom(searchParams)}`,
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }) {
  const q = await queryFrom(searchParams);
  if (!q) {
    redirect("/");
  }

  const fixed = { q };
  const [initial, categories, bestSellers] = await Promise.all([
    getInitialListing(searchParams, fixed),
    getCategories(),
    apiGet("/products?type=single&sort=popular&limit=8", { revalidate: 300, tags: ["products"] }),
  ]);

  return (
    <Container className="py-6">
      <ListingHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
        title={`Results for “${q}”`}
      />
      <ListingView
        key={q}
        fixed={fixed}
        initial={initial}
        highlight={q}
        noResults={
          <NoResults query={q} categories={categories} bestSellers={bestSellers ?? []} />
        }
      />
    </Container>
  );
}
