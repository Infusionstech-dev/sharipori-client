import { Suspense } from "react";
import TrackOrderView from "@/components/order/TrackOrderView";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

export const metadata = {
  title: "Track your order | Shari Shop",
  description: "Check where your Shari Shop order is with your order number and phone.",
};

export default function TrackOrderPage() {
  return (
    <Container className="py-8">
      <h1 className="mb-2 text-center font-display text-3xl text-primary">Track your order</h1>
      <p className="mb-6 text-center text-sm text-text/70">
        Enter the order number from your confirmation and the phone number you ordered with.
      </p>
      {/* useSearchParams needs a boundary so the rest of the page can still be pre-rendered. */}
      <Suspense fallback={<Skeleton className="mx-auto h-64 max-w-lg" />}>
        <TrackOrderView />
      </Suspense>
    </Container>
  );
}
