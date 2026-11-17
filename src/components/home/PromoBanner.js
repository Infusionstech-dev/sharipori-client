import Link from "next/link";
import Container from "@/components/ui/Container";
import BannerImage from "./BannerImage";

// A mid-page banner set up in admin (position "home_middle"). The picture keeps its own shape, so
// the banner is as tall as the image needs. On desktops the text sits on the picture over a dark
// fade; on phones and tablets a wide picture is too short for it, so the text goes underneath.
export default function PromoBanner({ banner }) {
  const { title, subtitle, buttonText, link, imageUrl, mobileImageUrl } = banner;

  return (
    <section className="py-8">
      <Container>
        <div className="relative overflow-hidden rounded-lg bg-primary lg:grid">
          <BannerImage
            image={imageUrl}
            mobileImage={mobileImageUrl}
            alt={title}
            href={link}
            className="lg:[grid-area:1/1]"
            // If the text is ever taller than a very wide picture, the picture fills behind it.
            imageClassName="lg:h-full lg:object-cover"
          />
          <div className="relative p-5 text-white lg:pointer-events-none lg:self-end lg:bg-gradient-to-t lg:from-black/70 lg:to-transparent lg:px-10 lg:pb-8 lg:pt-16 lg:[grid-area:1/1]">
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl xl:text-4xl">{title}</h2>
            {subtitle && <p className="mt-1 max-w-xl text-sm md:text-base">{subtitle}</p>}
            {link && buttonText && (
              <Link
                href={link}
                className="pointer-events-auto mt-4 inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-text hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
