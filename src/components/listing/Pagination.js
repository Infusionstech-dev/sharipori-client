"use client";

import clsx from "clsx";

const BUTTON_CLASS =
  "flex size-11 items-center justify-center rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

// First, last and two either side of the current page, with gaps between.
const visiblePages = (page, totalPages) => {
  const pages = [];
  for (let n = 1; n <= totalPages; n += 1) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 2) {
      pages.push(n);
    }
  }
  return pages;
};

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages < 2) {
    return null;
  }

  return (
    <nav aria-label="Pages" className="mt-8 hidden justify-center gap-1 md:flex">
      {visiblePages(page, totalPages).map((n, index, pages) => (
        <span key={n} className="flex items-center gap-1">
          {index > 0 && n - pages[index - 1] > 1 && <span aria-hidden="true">…</span>}
          <button
            type="button"
            aria-label={`Page ${n}`}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onChange(n)}
            className={clsx(
              BUTTON_CLASS,
              n === page ? "bg-primary font-semibold text-white" : "hover:bg-soft"
            )}
          >
            {n}
          </button>
        </span>
      ))}
    </nav>
  );
}
