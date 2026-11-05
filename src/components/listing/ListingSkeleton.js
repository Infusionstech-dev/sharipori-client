import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

const CARDS = Array.from({ length: 6 }, (_, index) => index);

export default function ListingSkeleton() {
  return (
    <Container role="status" aria-label="Loading" className="py-6">
      <Skeleton className="mb-2 h-4 w-40" />
      <Skeleton className="mb-6 h-9 w-64" />
      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
        <Skeleton className="hidden h-96 lg:block" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {CARDS.map((card) => (
            <Skeleton key={card} className="aspect-[3/4]" />
          ))}
        </div>
      </div>
    </Container>
  );
}
