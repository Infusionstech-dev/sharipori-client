import { cache } from "react";
import { notFound } from "next/navigation";
import { apiGetResponse, getFabrics } from "./api";
import { paramsFromObject, parseFilters, queryKey, toApiQuery } from "./listing";

const LISTING_REVALIDATE_SECONDS = 60;

// The first page comes from the server for SEO. Null lets ListingView fetch it in the browser.
export async function getInitialListing(searchParams, fixed) {
  const filters = parseFilters(paramsFromObject(await searchParams), fixed);
  const query = toApiQuery(filters, fixed);
  const response = await apiGetResponse(
    `/products?${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]))}`,
    { revalidate: LISTING_REVALIDATE_SECONDS, tags: ["products"] }
  );

  return response?.data
    ? { key: queryKey(query), result: { data: response.data, meta: response.meta } }
    : null;
}

// Called from a layout too: that runs before the loading skeleton starts the response,
// which is the only point where a real 404 status can still be sent.
export const getCategoryOrNotFound = cache(async (slug) => {
  const response = await apiGetResponse(`/categories/${encodeURIComponent(slug)}`, {
    revalidate: 300,
    tags: ["categories"],
  });
  if (response?.status === 400 || response?.status === 404) {
    notFound();
  }
  if (!response?.data) {
    // An API outage must not tell customers and search engines the page is gone.
    throw new Error("Could not load the category");
  }
  return response.data;
});

export const getFabricOrNotFound = cache(async (slug) => {
  const fabric = (await getFabrics()).find((item) => item.slug === slug);
  if (!fabric) {
    notFound();
  }
  return fabric;
});
