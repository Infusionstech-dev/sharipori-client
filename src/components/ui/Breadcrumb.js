import Link from "next/link";

// crumbs: [{ label, href }]. The last one is the current page and has no link.
export default function Breadcrumb({ crumbs }) {
  return (
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
  );
}
