import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

const CARDS = Array.from({ length: 8 }, (_, index) => index);

export default function Loading() {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="h-96 rounded-none md:h-[28rem]" />
      <Container className="py-8">
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {CARDS.map((card) => (
            <Skeleton key={card} className="aspect-[3/4]" />
          ))}
        </div>
      </Container>
    </div>
  );
}
