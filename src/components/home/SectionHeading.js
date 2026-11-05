import Link from "next/link";

export default function SectionHeading({ title, viewAllHref }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl text-primary md:text-3xl">{title}</h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="shrink-0 rounded py-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View all
        </Link>
      )}
    </div>
  );
}
