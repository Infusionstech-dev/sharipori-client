"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import DialogPanel from "@/components/ui/DialogPanel";
import { clearedFilters, countActiveFilters, toApiQuery } from "@/lib/listing";
import { useGetProductsQuery } from "@/store/api/productApi";
import FilterPanel from "./FilterPanel";

export default function FilterDrawer({ facets, filters, fixed, onApply, subcategories, hideFabric }) {
  const [draft, setDraft] = useState(null);
  const open = draft !== null;

  // Changes wait for Apply, but the counts and the button's total follow what is ticked.
  const { data } = useGetProductsQuery({ ...toApiQuery(draft ?? filters, fixed), limit: 1 }, {
    skip: !open,
  });
  const activeCount = countActiveFilters(filters);

  return (
    <>
      <Button variant="outline" onClick={() => setDraft(filters)}>
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filter{activeCount > 0 && ` (${activeCount})`}
      </Button>

      <DialogPanel
        open={open}
        onClose={() => setDraft(null)}
        title="Filter"
        className="m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-lg"
      >
        {open && (
          <>
            <FilterPanel
              facets={data?.meta.facets ?? facets}
              filters={draft}
              onChange={setDraft}
              subcategories={subcategories}
              hideFabric={hideFabric}
            />
            <div className="sticky bottom-0 -mx-4 -mb-4 flex gap-2 border-t border-soft bg-white p-4">
              <Button variant="outline" onClick={() => setDraft(clearedFilters(filters))}>
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onApply(draft);
                  setDraft(null);
                }}
              >
                {data ? `Show ${data.meta.total} ${data.meta.total === 1 ? "product" : "products"}` : "Apply"}
              </Button>
            </div>
          </>
        )}
      </DialogPanel>
    </>
  );
}
