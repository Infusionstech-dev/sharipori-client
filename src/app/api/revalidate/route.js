import { timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";

// Tags the backend may clear. Anything else is ignored.
const ALLOWED_TAGS = ["settings", "banners", "pages", "products", "categories", "fabrics"];

const secretMatches = (sent) => {
  const expected = process.env.REVALIDATE_SECRET ?? "";
  if (!expected || typeof sent !== "string" || sent.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(sent), Buffer.from(expected));
};

// Called by the backend after admin saves, so changes show on the next page load.
export async function POST(request) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ success: false, message: "Not allowed" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: "Invalid body" }, { status: 400 });
  }
  const tags = (Array.isArray(body?.tags) ? body.tags : []).filter((tag) =>
    ALLOWED_TAGS.includes(tag)
  );
  // expire 0: the next visitor gets fresh data instead of one more stale page.
  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
  return Response.json({ success: true, revalidated: tags });
}
