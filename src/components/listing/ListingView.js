"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import {
  clearedFilters,
  countActiveFilters,
  parseFilters,
  queryKey,
  toApiQuery,
  toSearchString,
} from "@/lib/listing";
import { useGetProductsQuery } from "@/store/api/productApi";
import ActiveFilters from "./ActiveFilters";
import FilterDrawer from "./FilterDrawer";
import FilterPanel from "./FilterPanel";
import Pagination from "./Pagination";
import ProductGrid, { GridItems, GridSkeletons } from "./ProductGrid";
import SortSelect from "./SortSelect";

// The server's page is used for its exact query, so opening a page costs no second request.
function useListingPage(query, initial) {
  const useInitial = initial?.key === queryKey(query);
  const { currentData, isError, refetch } = useGetProductsQuery(query, { skip: useInitial });

  if (useInitial) {
    return { result: initial.result, isLoading: false, isError: false };
  }
  return { result: currentData, isLoading: !currentData && !isError, isError, refetch };
}

function EarlierPage({ query, initial, packages }) {
  const { result, isLoading } = useListingPage(query, initial);
  return isLoading ? (
    <GridSkeletons packages={packages} />
  ) : (
    <GridItems products={result?.data ?? []} packages={packages} />
  );
}

export default function ListingView({ fixed = {}, initial, subcategories = [], packages = false }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams, fixed);
  const query = toApiQuery(filters, fixed);
  const baseKey = queryKey({ ...query, page: 1 });
  const hideFabric = Boolean(fixed.fabric);

  // Where "Load more" started, for these filters only. Null means one page at a time.
  const [loadStart, setLoadStart] = useState(null);
  const startPage = loadStart?.baseKey === baseKey ? loadStart.page : filters.page;

  const { result, isLoading, isError, refetch } = useListingPage(query, initial);

  // Facets stay on screen while the next results load, so the panel does not jump.
  const [facets, setFacets] = useState(initial?.result.meta.facets ?? null);
  if (result && result.meta.facets !== facets) {
    setFacets(result.meta.facets);
  }

  // The History API changes the URL without asking the server for the page again.
  // Next keeps useSearchParams in step with it, including the back button.
  const navigate = (next, method = "pushState") => {
    const search = toSearchString(next);
    if (search !== searchParams.toString()) {
      window.history[method](null, "", search ? `${pathname}?${search}` : pathname);
    }
  };

  const goToPage = (page) => {
    setLoadStart(null);
    navigate({ ...filters, page });
    window.scrollTo({ top: 0 });
  };

  const loadMore = () => {
    setLoadStart({ baseKey, page: startPage });
    navigate({ ...filters, page: filters.page + 1 }, "replaceState");
  };

  const products = result?.data ?? [];
  const totalPages = result?.meta.totalPages ?? 0;
  const earlierPages = [];
  for (let page = startPage; page < filters.page; page += 1) {
    earlierPages.push(page);
  }

  let content;
  if (isError) {
    content = (
      <EmptyState
        title="Could not load products"
        description="Please check your connection and try again."
        action={
          <Button variant="outline" onClick={refetch}>
            Try again
          </Button>
        }
      />
    );
  } else if (!isLoading && !products.length && !earlierPages.length) {
    content = (
      <EmptyState
        title="No products match these filters"
        description="Try removing a filter to see more."
        action={
          countActiveFilters(filters) > 0 && (
            <Button variant="outline" onClick={() => navigate(clearedFilters(filters))}>
              Clear filters
            </Button>
          )
        }
      />
    );
  } else {
    content = (
      <>
        <ProductGrid products={products} packages={packages} isLoading={isLoading}>
          {earlierPages.map((page) => (
            <EarlierPage
              key={page}
              query={{ ...query, page }}
              initial={initial}
              packages={packages}
            />
          ))}
        </ProductGrid>
        <Pagination page={filters.page} totalPages={totalPages} onChange={goToPage} />
        {filters.page < totalPages && (
          <div className="mt-6 flex justify-center md:hidden">
            <Button variant="outline" onClick={loadMore}>
              Load more
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
      <aside aria-label="Filters" className="hidden lg:block">
        <FilterPanel
          facets={facets}
          filters={filters}
          onChange={navigate}
          subcategories={subcategories}
          hideFabric={hideFabric}
        />
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p aria-live="polite" className="text-sm text-text/70">
            {result ? `${result.meta.total} ${result.meta.total === 1 ? "product" : "products"}` : "Loading products"}
          </p>
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <FilterDrawer
                facets={facets}
                filters={filters}
                fixed={fixed}
                onApply={navigate}
                subcategories={subcategories}
                hideFabric={hideFabric}
              />
            </div>
            <SortSelect
              value={filters.sort}
              onChange={(sort) => navigate({ ...filters, sort, page: 1 })}
            />
          </div>
        </div>
        <ActiveFilters facets={facets} filters={filters} onChange={navigate} />
        {content}
      </div>
    </div>
  );
}
