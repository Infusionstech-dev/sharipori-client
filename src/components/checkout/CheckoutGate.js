"use client";

import { useSelector } from "react-redux";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import CheckoutView from "./CheckoutView";

// Guests and logged-in customers both check out here. The page waits for the session check
// so it knows which cart to use and whether to fill in the customer's name and phone.
export default function CheckoutGate() {
  const authStatus = useSelector((state) => state.auth.status);

  if (authStatus === "authenticated" || authStatus === "unauthenticated") {
    return <CheckoutView />;
  }

  if (authStatus === "unavailable") {
    return (
      <div role="alert" className="rounded-lg bg-soft/50 p-8 text-center">
        <p className="mb-4">We could not load checkout just now. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  // Idle or still checking the session.
  return (
    <div role="status" aria-label="Loading checkout" className="space-y-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
