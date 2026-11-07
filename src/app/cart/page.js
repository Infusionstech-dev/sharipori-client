import CartView from "@/components/cart/CartView";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Cart | Shari Shop",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <Container className="py-6">
      <h1 className="mb-6 font-display text-3xl text-primary">Your cart</h1>
      <CartView />
    </Container>
  );
}
