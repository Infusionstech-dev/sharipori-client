import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT_MS = 5000;
const LAYOUT_REVALIDATE_SECONDS = 600;

// Returns null when the API fails, so one bad response never takes the whole page down.
export async function apiGet(path, { revalidate, tags } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate, tags },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      return null;
    }
    const body = await response.json();
    return body.data ?? null;
  } catch {
    return null;
  }
}

// cache() because fetch skips its own request sharing when it is given a signal.
export const getCategories = cache(
  async () =>
    (await apiGet("/categories", {
      revalidate: LAYOUT_REVALIDATE_SECONDS,
      tags: ["categories"],
    })) ?? []
);

export const getFabrics = cache(
  async () =>
    (await apiGet("/fabrics", {
      revalidate: LAYOUT_REVALIDATE_SECONDS,
      tags: ["fabrics"],
    })) ?? []
);
