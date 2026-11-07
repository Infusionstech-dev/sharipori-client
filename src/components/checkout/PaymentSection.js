"use client";

import RadioCard from "./RadioCard";
import Section from "./Section";

// Only cash on delivery for now. Online methods arrive with T9.1, read from public settings.
const METHODS = [
  { value: "cod", title: "Cash on Delivery", detail: "Pay when your order arrives" },
];

export default function PaymentSection({ value, onChange }) {
  return (
    <Section step={4} title="Payment">
      <div role="radiogroup" aria-label="Payment method" className="space-y-2">
        {METHODS.map((method) => (
          <RadioCard
            key={method.value}
            name="paymentMethod"
            value={method.value}
            checked={value === method.value}
            onChange={() => onChange(method.value)}
            title={method.title}
            detail={method.detail}
          />
        ))}
      </div>
    </Section>
  );
}
