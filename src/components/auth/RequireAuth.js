"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, signedOutByUser } = useSelector((state) => state.auth);

  useEffect(() => {
    // After choosing Logout the user is already on the way to the home page.
    if (status === "unauthenticated" && !signedOutByUser) {
      const next = encodeURIComponent(pathname + window.location.search);
      router.replace(`/login?next=${next}`);
    }
  }, [status, signedOutByUser, pathname, router]);

  if (status === "unavailable") {
    return (
      <Container className="py-8">
        <EmptyState
          title="We could not check your session"
          description="You have not been logged out. Please wait a moment and try again."
          action={
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try again
            </Button>
          }
        />
      </Container>
    );
  }

  if (status !== "authenticated") {
    return (
      <Container className="space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </Container>
    );
  }

  return children;
}
