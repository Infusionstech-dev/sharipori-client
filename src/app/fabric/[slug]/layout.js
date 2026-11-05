import { getFabricOrNotFound } from "@/lib/listingServer";

export default async function Layout({ params, children }) {
  await getFabricOrNotFound((await params).slug);
  return children;
}
