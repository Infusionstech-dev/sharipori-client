import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export function LoadError({ what, onRetry }) {
  return (
    <EmptyState
      title={`Could not load your ${what}`}
      description="Please check your connection and try again."
      action={
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}

export function PageTitle({ children, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h1 className="font-display text-2xl text-primary md:text-3xl">{children}</h1>
      {action}
    </div>
  );
}
