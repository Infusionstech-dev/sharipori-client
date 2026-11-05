import Link from "next/link";
import Container from "@/components/ui/Container";
import { fabricHref } from "@/lib/siteConfig";
import SectionHeading from "./SectionHeading";

export default function FabricChips({ fabrics }) {
  if (!fabrics.length) {
    return null;
  }

  return (
    <section className="py-8">
      <Container>
        <SectionHeading title="Shop by fabric" />
        <ul className="flex flex-wrap gap-2">
          {fabrics.map((fabric) => (
            <li key={fabric.id}>
              <Link
                href={fabricHref(fabric.slug)}
                className="flex min-h-11 items-center gap-2 rounded-full border border-primary/30 bg-white px-4 text-sm font-medium hover:border-primary hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {fabric.nameEn}
                <span className="font-bangla text-xs font-normal text-text/70">{fabric.nameBn}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
