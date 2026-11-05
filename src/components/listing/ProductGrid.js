import clsx from "clsx";
import PackageCard from "@/components/product/PackageCard";
import ProductCard from "@/components/product/ProductCard";
import Skeleton from "@/components/ui/Skeleton";

const SKELETON_COUNT = 6;

export function GridItems({ products, packages }) {
  return products.map((product) => (
    <li key={product.id}>
      {packages ? <PackageCard product={product} /> : <ProductCard product={product} />}
    </li>
  ));
}

export function GridSkeletons({ packages }) {
  return Array.from({ length: SKELETON_COUNT }, (_, index) => (
    <li key={index}>
      <Skeleton className={packages ? "h-72" : "aspect-[3/4]"} />
    </li>
  ));
}

// children are the rows already loaded by "Load more", shown before the current page.
export default function ProductGrid({ products, packages, isLoading, children }) {
  return (
    <ul
      aria-busy={isLoading}
      className={clsx(
        "grid gap-3 md:gap-4",
        packages ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-2 md:grid-cols-3"
      )}
    >
      {children}
      {isLoading ? (
        <GridSkeletons packages={packages} />
      ) : (
        <GridItems products={products} packages={packages} />
      )}
    </ul>
  );
}
