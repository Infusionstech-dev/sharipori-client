import Link from "next/link";
import Container from "@/components/ui/Container";
import RemoteImage from "@/components/ui/RemoteImage";
import { categoryHref } from "@/lib/siteConfig";

function Half({ image, label }) {
  return (
    <div className="relative h-56 bg-soft md:h-80">
      {image && (
        <RemoteImage
          src={image}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover"
        />
      )}
      <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-0.5 text-xs font-medium">
        {label}
      </span>
    </div>
  );
}

export default function MatchingBanner({ motherImage, babyImage }) {
  return (
    <section className="py-8">
      <Container>
        <div className="grid overflow-hidden rounded-lg bg-soft md:grid-cols-2">
          <div className="grid grid-cols-2">
            <Half image={motherImage} label="Mom" />
            <Half image={babyImage} label="Baby" />
          </div>
          <div className="flex flex-col items-start justify-center gap-3 p-6 md:p-10">
            <h2 className="font-display text-3xl text-primary">Mother &amp; Baby Matching</h2>
            <p className="text-sm text-text/80 md:text-base">
              Traditional outfits chosen to go together, for you and your little one.
            </p>
            <Link
              href={categoryHref("combo-packages")}
              className="flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Shop matching sets
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
