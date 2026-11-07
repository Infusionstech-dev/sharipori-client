import Link from "next/link";
import Container from "@/components/ui/Container";
import RemoteImage from "@/components/ui/RemoteImage";

// A mid-page banner set up in admin (position "home_middle").
export default function PromoBanner({ banner }) {
  const { title, subtitle, buttonText, link, imageUrl, mobileImageUrl } = banner;

  return (
    <section className="py-8">
      <Container>
        <div className="relative isolate flex min-h-56 items-end overflow-hidden rounded-lg bg-primary md:min-h-72">
          <RemoteImage
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className={`-z-10 object-cover ${mobileImageUrl ? "hidden md:block" : ""}`}
          />
          {mobileImageUrl && (
            <RemoteImage
              src={mobileImageUrl}
              alt=""
              fill
              sizes="100vw"
              className="-z-10 object-cover md:hidden"
            />
          )}
          <div className="w-full bg-gradient-to-t from-black/70 to-transparent p-6 text-white md:p-10">
            <h2 className="font-display text-2xl md:text-4xl">{title}</h2>
            {subtitle && <p className="mt-1 max-w-xl text-sm md:text-base">{subtitle}</p>}
            {link && buttonText && (
              <Link
                href={link}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-text hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
