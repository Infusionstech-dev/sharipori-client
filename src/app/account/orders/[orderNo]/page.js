import OrderDetailView from "@/components/account/OrderDetailView";

export default async function OrderDetailPage({ params }) {
  const { orderNo } = await params;
  return <OrderDetailView orderNo={decodeURIComponent(orderNo).toUpperCase()} />;
}
