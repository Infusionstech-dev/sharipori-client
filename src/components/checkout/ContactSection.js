"use client";

import Input from "@/components/ui/Input";
import Section from "./Section";

export default function ContactSection({ register, errors }) {
  return (
    <Section step={1} title="Contact">
      <Input
        label="Full name *"
        autoComplete="name"
        error={errors.customerName?.message}
        {...register("customerName")}
      />
      <Input
        label="Phone *"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="01XXXXXXXXX"
        hint="We call this number to confirm your order."
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Input
        label="Email (optional)"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
    </Section>
  );
}
