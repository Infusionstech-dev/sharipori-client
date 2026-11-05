import PackageCard from "@/components/product/PackageCard";
import Container from "@/components/ui/Container";
import SectionHeading from "./SectionHeading";

// packages: [{ label, product }], where product may be missing.
export default function PackagesSection({ packages }) {
  const available = packages.filter(({ product }) => product);
  if (!available.length) {
    return null;
  }

  return (
    <section className="py-8">
      <Container>
        <SectionHeading title="Packages" viewAllHref="/packages" />
        <div className="grid gap-4 lg:grid-cols-2">
          {available.map(({ label, product }) => (
            <PackageCard key={product.id} product={product} label={label} />
          ))}
        </div>
      </Container>
    </section>
  );
}
