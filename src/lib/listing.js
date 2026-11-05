export const PAGE_SIZE = 24;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "popular", label: "Popular" },
];

const SLUG_LIST = /^[a-z0-9-]+(,[a-z0-9-]+)*$/;
const ID_LIST = /^\d+(,\d+)*$/;
const MAX_PRICE = 99999999;

const parseList = (value, pattern) => (value && pattern.test(value) ? value.split(",") : []);

const parsePrice = (value) => {
  if (value === null || value === "") {
    return null;
  }
  const price = Number(value);
  return price >= 0 && price <= MAX_PRICE ? price : null;
};

// URLs can be edited or mistyped, and the API rejects bad values, so those values are dropped here.
export function parseFilters(params, fixed = {}) {
  const minPrice = parsePrice(params.get("minPrice"));
  const maxPrice = parsePrice(params.get("maxPrice"));
  const page = Number(params.get("page"));
  const sort = params.get("sort");

  return {
    fabric: fixed.fabric ? [] : parseList(params.get("fabric"), SLUG_LIST),
    size: parseList(params.get("size"), ID_LIST),
    color: parseList(params.get("color"), ID_LIST),
    minPrice,
    maxPrice: minPrice !== null && maxPrice !== null && maxPrice < minPrice ? null : maxPrice,
    inStock: params.get("inStock") === "true",
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : "newest",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

// The address bar version: default values stay out so shared links are short.
export function toSearchString(filters) {
  const params = new URLSearchParams();
  ["fabric", "size", "color"].forEach((key) => {
    if (filters[key].length) {
      params.set(key, filters[key].join(","));
    }
  });
  if (filters.minPrice !== null) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== null) params.set("maxPrice", filters.maxPrice);
  if (filters.inStock) params.set("inStock", "true");
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", filters.page);
  return params.toString();
}

export function toApiQuery(filters, fixed = {}) {
  const query = Object.fromEntries(new URLSearchParams(toSearchString(filters)));
  return { ...query, ...fixed, sort: filters.sort, page: filters.page, limit: PAGE_SIZE };
}

export const queryKey = (query) => {
  const params = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]));
  params.sort();
  return params.toString();
};

export const clearedFilters = (filters) => ({
  fabric: [],
  size: [],
  color: [],
  minPrice: null,
  maxPrice: null,
  inStock: false,
  sort: filters.sort,
  page: 1,
});

export const countActiveFilters = (filters) =>
  filters.fabric.length +
  filters.size.length +
  filters.color.length +
  (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
  (filters.inStock ? 1 : 0);

// Next gives server pages a plain object: a repeated parameter arrives as an array.
export function paramsFromObject(searchParams) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    params.set(key, Array.isArray(value) ? value[0] : value);
  });
  return params;
}
