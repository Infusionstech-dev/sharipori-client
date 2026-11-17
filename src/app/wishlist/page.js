import WishlistView from "@/components/wishlist/WishlistView";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Wishlist | Shari Shop",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <Container className="py-6">
      <h1 className="mb-6 font-display text-3xl text-primary">Your wishlist</h1>
      <WishlistView />
    </Container>
  );
}
