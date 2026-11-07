"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { findDistrict } from "@/data/bd-locations";
import useCart from "@/hooks/useCart";
import { serverMessage } from "@/lib/authForms";
import { formatBDT } from "@/lib/format";
import { saveLastOrder } from "@/lib/lastOrder";
import { useClearCartMutation } from "@/store/api/cartApi";
import {
  useGetDeliveryZonesQuery,
  useGetQuoteQuery,
  usePlaceOrderMutation,
} from "@/store/api/checkoutApi";
import { baseApi } from "@/store/api/baseApi";
import { clear } from "@/store/slices/cartSlice";
import AddressSection from "./AddressSection";
import ContactSection from "./ContactSection";
import DeliverySection from "./DeliverySection";
import OrderSummary from "./OrderSummary";
import PaymentSection from "./PaymentSection";

const QUOTE_DELAY_MS = 300;
const FORM_ID = "checkout-form";

const schema = z
  .object({
    customerName: z.string().trim().min(2, "Enter your name").max(100),
    phone: z
      .string()
      .trim()
      .regex(/^01[3-9]\d{8}$/, "Enter a valid phone number like 01XXXXXXXXX"),
    email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]),
    district: z
      .string()
      .trim()
      .refine((value) => findDistrict(value), "Choose a district from the list"),
    thana: z.string().min(1, "Choose your thana or upazila"),
    addressLine: z.string().trim().min(5, "Enter your house, road and area").max(255),
    note: z.string().trim().max(500),
    deliveryZoneId: z.number({ message: "Choose a delivery area" }).int().positive(),
    paymentMethod: z.literal("cod"),
    saveAddress: z.boolean(),
  })
  .refine((value) => findDistrict(value.district)?.thanas.some((t) => t.en === value.thana), {
    path: ["thana"],
    message: "Choose your thana or upazila",
  });

// Inside Dhaka for Dhaka district, the other zone everywhere else. Matched by the zone's name.
const zoneForDistrict = (zones, district) => {
  const inside = zones.find((zone) => /inside dhaka/i.test(zone.nameEn));
  const outside = zones.find((zone) => /outside dhaka/i.test(zone.nameEn));
  return district === "Dhaka" ? inside : outside;
};

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function CheckoutView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cart = useCart();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [coupon, setCoupon] = useState(null);
  const [changedItems, setChangedItems] = useState([]);
  const [placed, setPlaced] = useState(false);

  const zonesQuery = useGetDeliveryZonesQuery();
  const zones = zonesQuery.data ?? [];
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const [clearServerCart] = useClearCartMutation();

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      district: "",
      thana: "",
      addressLine: "",
      note: "",
      deliveryZoneId: undefined,
      paymentMethod: "cod",
      saveAddress: true,
    },
  });
  // The session may finish loading after the form was set up. Fill in what the customer
  // has not typed yet, and never overwrite what they have.
  useEffect(() => {
    if (!user) {
      return;
    }
    [
      ["customerName", user.name],
      ["phone", user.phone],
      ["email", user.email],
    ].forEach(([field, value]) => {
      if (value && !getValues(field)) {
        setValue(field, value);
      }
    });
  }, [user, getValues, setValue]);

  const [district, deliveryZoneId, paymentMethod] = useWatch({
    control,
    name: ["district", "deliveryZoneId", "paymentMethod"],
  });

  // Only buyable lines are sent: the cart page already blocks checkout while others remain.
  const items = cart.items
    .filter((line) => line.status !== "out_of_stock" && line.status !== "unavailable")
    .map(({ variantId, quantity }) => ({ variantId, quantity }));
  const quoteArgs = useDebounced(
    JSON.stringify({ items, deliveryZoneId: deliveryZoneId || undefined, couponCode: coupon }),
    QUOTE_DELAY_MS
  );
  // Skip on the delayed arguments themselves: the live list can be ahead of what is sent.
  const quoteBody = JSON.parse(quoteArgs);
  const quoteQuery = useGetQuoteQuery(quoteBody, {
    skip: cart.isLoading || !quoteBody.items.length,
  });
  const quote = quoteQuery.data;
  const couponError = quote?.errors.find((error) => error.field === "couponCode")?.message;

  useEffect(() => {
    if (!cart.isLoading && !cart.items.length && !placed) {
      router.replace("/cart");
    }
  }, [cart.isLoading, cart.items.length, placed, router]);

  const onDistrictChange = (value) => {
    setValue("thana", "");
    const zone = zoneForDistrict(zones, value);
    if (findDistrict(value) && zone) {
      setValue("deliveryZoneId", zone.id, { shouldValidate: true });
    }
  };

  const onSubmit = async (values) => {
    setChangedItems([]);
    try {
      const result = await placeOrder({
        ...values,
        email: values.email || undefined,
        note: values.note || undefined,
        couponCode: coupon && !couponError ? coupon : undefined,
        saveAddress: cart.loggedIn ? values.saveAddress : false,
        items,
        idempotencyKey,
      }).unwrap();

      setPlaced(true);
      saveLastOrder({
        ...result,
        phone: values.phone,
        lines: cart.items.map(({ name, size, color, quantity, lineTotal, image }) => ({
          name,
          size,
          color,
          quantity,
          lineTotal,
          image,
        })),
        subtotal: quote?.subtotal,
        deliveryCharge: quote?.deliveryCharge,
        discount: quote?.discount,
      });
      if (cart.loggedIn) {
        await clearServerCart()
          .unwrap()
          .catch(() => {});
      } else {
        dispatch(clear());
      }
      // Online payment (T9.1) will redirect when nextAction is redirect_payment.
      router.replace(`/order-success/${result.orderNo}`);
    } catch (error) {
      if (error?.status === 409 && Array.isArray(error.data?.details)) {
        const byVariant = new Map(cart.items.map((line) => [line.variantId, line]));
        setChangedItems(
          error.data.details.map((detail) => ({
            name: byVariant.get(detail.variantId)?.name ?? "An item",
            message: detail.message,
          }))
        );
        // Fresh stock and prices for the cart and the totals. The form keeps what was typed.
        dispatch(baseApi.util.invalidateTags(["Cart"]));
        quoteQuery.refetch();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(serverMessage(error, "Could not place your order. Please try again."));
      }
    }
  };

  if (cart.isLoading || (!cart.items.length && !placed)) {
    return <Skeleton className="h-96" />;
  }

  const total = quote ? formatBDT(quote.total) : "";
  const summary = (
    <OrderSummary
      items={cart.items}
      quote={quote}
      quoting={quoteQuery.isFetching}
      coupon={coupon}
      couponError={couponError}
      onApply={setCoupon}
      onRemove={() => setCoupon(null)}
    />
  );

  return (
    <div className="pb-24 md:pb-0">
      {/* On phones the summary is folded at the top, so the form comes first. */}
      <details className="mb-4 rounded-lg bg-white ring-1 ring-soft lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-1">
            Order summary <ChevronDown className="size-4" aria-hidden="true" />
          </span>
          <span className="font-semibold text-primary">{total}</span>
        </summary>
        <div className="border-t border-soft p-4">{summary}</div>
      </details>

      {changedItems.length > 0 && (
        <div role="alert" className="mb-4 rounded-lg bg-soft p-4 text-sm">
          <p className="mb-2 font-semibold text-primary">Some items in your cart have changed</p>
          <ul className="mb-2 list-disc pl-5">
            {changedItems.map((item) => (
              <li key={item.name}>
                {item.name}: {item.message}
              </li>
            ))}
          </ul>
          <Link href="/cart" className="font-medium text-primary underline">
            Review your cart
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <form id={FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ContactSection register={register} errors={errors} />
          <AddressSection
            register={register}
            errors={errors}
            district={district}
            loggedIn={cart.loggedIn}
            onDistrictChange={onDistrictChange}
          />
          <DeliverySection
            zones={zones}
            isLoading={zonesQuery.isLoading}
            isError={zonesQuery.isError}
            refetch={zonesQuery.refetch}
            value={deliveryZoneId}
            onChange={(id) => setValue("deliveryZoneId", id, { shouldValidate: true })}
            error={errors.deliveryZoneId?.message}
          />
          <PaymentSection
            value={paymentMethod}
            onChange={(method) => setValue("paymentMethod", method)}
          />
          <Button type="submit" size="lg" loading={placing} className="hidden w-full md:flex">
            Place order {total && `· ${total}`}
          </Button>
        </form>

        <aside aria-label="Order summary" className="hidden lg:block">
          <div className="sticky top-20 rounded-lg bg-white p-5 ring-1 ring-soft">
            <h2 className="mb-4 font-display text-xl text-primary">Order summary</h2>
            {summary}
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-14 z-20 flex items-center justify-between gap-3 border-t border-soft bg-white px-4 py-2 md:hidden">
        <span>
          <span className="block text-xs text-text/70">Total</span>
          <span className="font-semibold text-primary">{total}</span>
        </span>
        <Button type="submit" form={FORM_ID} loading={placing}>
          Place order
        </Button>
      </div>
    </div>
  );
}
