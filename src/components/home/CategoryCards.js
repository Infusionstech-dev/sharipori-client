import Link from "next/link";
import Container from "@/components/ui/Container";
import RemoteImage from "@/components/ui/RemoteImage";
import { categoryHref } from "@/lib/siteConfig";

export default function CategoryCards({ categories }) {
  if (!categories.length) {
    return null;
  }

  return (
    <section aria-label="Shop by category" className="py-8">
      <Container>
        <ul className="flex snap-x gap-4 overflow-x-auto pb-2 md:justify-center md:gap-10">
          {categories.map((category) => (
            <li key={category.id} className="w-24 shrink-0 snap-start md:w-32">
              <Link
                href={categoryHref(category.slug)}
                className="group block rounded-lg text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="relative mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full bg-soft font-display text-3xl text-primary ring-2 ring-accent/40 transition group-hover:ring-accent md:size-28">
                  {category.image ? (
                    <RemoteImage
                      src={category.image}
                      fill
                      sizes="(min-width: 768px) 112px, 80px"
                      className="object-cover"
                    />
                  ) : (
                    <span aria-hidden="true">{category.nameEn[0]}</span>
                  )}
                </span>
                <span className="mt-2 block text-sm font-medium leading-tight">
                  {category.nameEn}
                </span>
                <span className="block font-bangla text-xs text-text/70">{category.nameBn}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
