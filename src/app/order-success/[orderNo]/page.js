import { notFound } from "next/navigation";
import OrderSuccess from "@/components/checkout/OrderSuccess";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Order placed | Shari Shop",
  robots: { index: false },
};

export default async function OrderSuccessPage({ params }) {
  const { orderNo } = await params;
  if (!/^SS-\d{8}-\d{4,}$/.test(orderNo)) {
    notFound();
  }
  return (
    <Container className="py-8">
      <OrderSuccess orderNo={orderNo} />
    </Container>
  );
}
