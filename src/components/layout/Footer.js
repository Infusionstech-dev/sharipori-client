import Link from "next/link";
import Container from "@/components/ui/Container";
import { getCategories, getSettings } from "@/lib/api";
import { categoryHref, pageHref } from "@/lib/siteConfig";

const HELP_LINKS = [
  ["Track order", "/track-order"],
  ["Size guide", pageHref("size-guide")],
  ["Return policy", pageHref("return-policy")],
  ["FAQ", pageHref("faq")],
  ["Contact", pageHref("contact")],
  ["About us", pageHref("about")],
  ["Privacy policy", pageHref("privacy-policy")],
  ["Terms", pageHref("terms")],
];


const LINK_CLASS =
  "inline-block py-1 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

function Column({ title, children }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-lg text-primary">{title}</h2>
      {children}
    </div>
  );
}

export default async function Footer() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const { shopName, phone, email, address, facebookUrl, instagramUrl, youtubeUrl } = settings;
  const hasContact = phone || email || address;

  return (
    <footer className="bg-soft text-sm">
      <Container className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <Column title={shopName}>
          <p className="text-text/80">Traditional clothing for babies and mothers in Bangladesh.</p>
          {(facebookUrl || instagramUrl || youtubeUrl) && (
            <p className="mt-3 flex gap-4">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                >
                  Facebook
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                >
                  Instagram
                </a>
              )}

              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_CLASS}
                >
                  YouTube
                </a>
              )}
            </p>
          )}
        </Column>

        <Column title="Shop">
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryHref(category.slug)} className={LINK_CLASS}>
                  {category.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Help">
          <ul>
            {HELP_LINKS.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className={LINK_CLASS}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Contact">
          {hasContact ? (
            <address className="not-italic">
              {phone && (
                <a href={`tel:${phone}`} className={`${LINK_CLASS} block`}>
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className={`${LINK_CLASS} block break-all`}>
                  {email}
                </a>
              )}
              {address && <p className="py-1 text-text/80">{address}</p>}
            </address>
          ) : (
            <Link href={pageHref("contact")} className={LINK_CLASS}>
              Contact us
            </Link>
          )}
        </Column>
      </Container>

      <div className="border-t border-primary/10">
        <Container className="flex justify-center py-4">
          <p className="text-xs text-text/70">
            © {new Date().getFullYear()} {shopName}
          </p>
        </Container>
      </div>
    </footer>
  );
}
