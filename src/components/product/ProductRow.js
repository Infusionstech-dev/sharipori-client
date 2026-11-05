import ProductCarousel from "@/components/home/ProductCarousel";
import SectionHeading from "@/components/home/SectionHeading";
import ProductCard from "./ProductCard";

export default function ProductRow({ title, products }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="py-6">
      <SectionHeading title={title} />
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
    </section>
  );
}
