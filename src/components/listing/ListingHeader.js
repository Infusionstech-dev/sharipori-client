import Link from "next/link";
import RemoteImage from "@/components/ui/RemoteImage";

// crumbs: [{ label, href }]. The last one is the current page and has no link.
export default function ListingHeader({ crumbs, title, titleBn, image }) {
  return (
    <header className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-text/70">
        <ol className="flex flex-wrap items-center gap-1">
          {crumbs.map((crumb, index) => (
            <li key={crumb.label} className="flex min-h-6 items-center gap-1">
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-primary hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {image && (
        <div className="relative mb-4 h-32 overflow-hidden rounded-lg bg-soft md:h-48">
          <RemoteImage src={image} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <h1 className="font-display text-3xl text-primary md:text-4xl">{title}</h1>
      {titleBn && <p className="font-bangla text-text/70">{titleBn}</p>}
    </header>
  );
}
