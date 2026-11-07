import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT_MS = 5000;
const LAYOUT_REVALIDATE_SECONDS = 600;

// Returns null when the request itself fails. Other responses keep their status for the caller.
export async function apiGetResponse(path, { revalidate, tags } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate, tags },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await response.json();
    return {
      status: response.status,
      data: response.ok ? (body.data ?? null) : null,
      meta: body.meta ?? null,
    };
  } catch {
    return null;
  }
}

// Null on any failure, so one bad response never takes the whole page down.
export async function apiGet(path, options) {
  return (await apiGetResponse(path, options))?.data ?? null;
}

// cache() because fetch skips its own request sharing when it is given a signal.
// Admin saves call /api/revalidate with these tags, so changes show without waiting.
const DEFAULT_SETTINGS = {
  shopName: "Shari Shop",
  freeDeliveryThreshold: null,
  enabledPaymentMethods: ["cod"],
};

export const getSettings = cache(
  async () =>
    (await apiGet("/settings/public", {
      revalidate: LAYOUT_REVALIDATE_SECONDS,
      tags: ["settings"],
    })) ?? DEFAULT_SETTINGS
);

export const getBanners = cache(
  async (position) =>
    (await apiGet(`/banners?position=${position}`, {
      revalidate: 60,
      tags: ["banners"],
    })) ?? []
);
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
