import { getCategoryOrNotFound } from "@/lib/listingServer";

export default async function Layout({ params, children }) {
  await getCategoryOrNotFound((await params).slug);
  return children;
}
