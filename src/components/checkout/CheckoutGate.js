"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import CheckoutView from "./CheckoutView";

const LOGIN_URL = `/login?next=${encodeURIComponent("/checkout")}`;

// Only a logged-in customer can check out. Guests can still fill a cart, and come straight
// back here after logging in.
export default function CheckoutGate() {
  const router = useRouter();
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(LOGIN_URL);
    }
  }, [status, router]);

  if (status === "authenticated") {
    return <CheckoutView />;
  }

  if (status === "unavailable") {
    return (
      <div role="alert" className="rounded-lg bg-soft/50 p-8 text-center">
        <p className="mb-4">We could not check your login just now. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  // Idle, checking, or about to go to the login page.
  return (
    <div role="status" aria-label="Checking your login" className="space-y-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
