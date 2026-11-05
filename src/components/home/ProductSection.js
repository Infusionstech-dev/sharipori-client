import ProductCard from "@/components/product/ProductCard";
import Container from "@/components/ui/Container";
import ProductCarousel from "./ProductCarousel";
import SectionHeading from "./SectionHeading";

export default function ProductSection({ title, viewAllHref, products, carousel = false }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="py-8">
      <Container>
        <SectionHeading title={title} viewAllHref={viewAllHref} />
        {carousel ? (
          <ProductCarousel label={title}>
            {products.map((product) => (
              <li
                key={product.id}
                className="min-w-0 flex-[0_0_50%] pl-4 md:flex-[0_0_33.333%] lg:flex-[0_0_25%]"
              >
                <ProductCard product={product} />
              </li>
            ))}
          </ProductCarousel>
        ) : (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
