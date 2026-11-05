import Link from "next/link";
import ProductRow from "@/components/product/ProductRow";
import EmptyState from "@/components/ui/EmptyState";
import { categoryHref } from "@/lib/siteConfig";

const TIPS = [
  "Check the spelling",
  "Try one word, such as “saree” or “শাড়ি”",
  "Search by fabric, such as “Jamdani”",
];

export default function NoResults({ query, categories, bestSellers }) {
  return (
    <div>
      <EmptyState
        title={`No results for “${query}”`}
        description={
          <span className="block">
            {TIPS.map((tip) => (
              <span key={tip} className="block">
                {tip}
              </span>
            ))}
          </span>
        }
        action={
          <ul className="mt-2 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={categoryHref(category.slug)}
                  className="flex min-h-11 items-center rounded-full border border-primary/30 bg-white px-4 text-sm font-medium hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {category.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        }
      />
      <ProductRow title="Best sellers" products={bestSellers} />
    </div>
  );
}
