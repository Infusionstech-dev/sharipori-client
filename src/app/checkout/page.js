import CheckoutView from "@/components/checkout/CheckoutView";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Checkout | Shari Shop",
  robots: { index: false },
};

// CheckoutView sends an empty cart back to /cart once the cart has loaded.
export default function CheckoutPage() {
  return (
    <Container className="py-6">
      <h1 className="mb-6 font-display text-3xl text-primary">Checkout</h1>
      <CheckoutView />
    </Container>
  );
}
