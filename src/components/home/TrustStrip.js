import { BadgeCheck, Banknote, RefreshCw, Truck } from "lucide-react";
import Container from "@/components/ui/Container";

const ITEMS = [
  [Banknote, "Cash on delivery"],
  [Truck, "Fast delivery"],
  [RefreshCw, "Easy exchange"],
  [BadgeCheck, "Authentic fabric"],
];

export default function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="mt-8 bg-white py-6">
      <Container>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ITEMS.map(([Icon, label]) => (
            <li key={label} className="flex items-center justify-center gap-2 text-sm font-medium">
              <Icon className="size-6 shrink-0 text-primary" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
