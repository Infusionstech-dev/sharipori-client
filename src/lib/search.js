const MAX_QUERY_LENGTH = 100;
const MAX_RECENT = 5;
const RECENT_KEY = "shari-recent-searches";

// Bangla letters like ড় can be typed in two Unicode forms that look the same.
// The database compares exact characters, so both must become one form.
export const cleanQuery = (value) =>
  String(value ?? "")
    .normalize("NFC")
    .trim()
    .slice(0, MAX_QUERY_LENGTH)
    .trim();

export const searchHref = (query) => `/search?q=${encodeURIComponent(cleanQuery(query))}`;

// Storage can be blocked or full. Recent searches are a convenience, so failures are ignored.
export function loadRecentSearches() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(RECENT_KEY));
    return Array.isArray(saved) ? saved.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

const saveRecentSearches = (items) => {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch {
    // Nothing to do: the search itself still works.
  }
};

export function addRecentSearch(query) {
  const cleaned = cleanQuery(query);
  if (!cleaned) {
    return;
  }
  const others = loadRecentSearches().filter(
    (item) => item.toLowerCase() !== cleaned.toLowerCase()
  );
  saveRecentSearches([cleaned, ...others].slice(0, MAX_RECENT));
}

export const clearRecentSearches = () => saveRecentSearches([]);
