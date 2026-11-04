"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Container from "@/components/ui/Container";
import Drawer from "@/components/ui/Drawer";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import PriceTag from "@/components/ui/PriceTag";
import Radio from "@/components/ui/Radio";
import Select from "@/components/ui/Select";
import Skeleton from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import Textarea from "@/components/ui/Textarea";
import { formatBDT, formatDate } from "@/lib/format";

const COLORS = [
  ["primary", "bg-primary"],
  ["accent", "bg-accent"],
  ["soft", "bg-soft"],
  ["bg", "bg-bg"],
  ["text", "bg-text"],
];

function Section({ title, children }) {
  return (
    <section className="space-y-4 border-t border-soft py-8">
      <h2 className="font-display text-2xl text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuidePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Container className="py-8">
      <h1 className="pb-8 font-display text-4xl text-primary">Style guide</h1>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {COLORS.map(([name, className]) => (
            <div key={name}>
              <div className={`h-16 rounded-lg border border-soft ${className}`} />
              <p className="mt-1 text-sm">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <p className="font-display text-3xl">Playfair Display: Mother&apos;s Saree</p>
        <p className="text-lg">Inter: Handwoven Katan and Jamdani</p>
        <p className="font-bangla text-lg">Hind Siliguri: বেবি রেডি শাড়ি ও মায়ের শাড়ি</p>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" onClick={() => toast.success("Added to cart")}>
            Show toast
          </Button>
        </div>
      </Section>

      <Section title="Form fields">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" placeholder="Your name" hint="As written on your ID" />
          <Input label="Phone" defaultValue="123" error="Enter a valid 01XXXXXXXXX number" />
          <Select
            label="Fabric"
            placeholder="Choose a fabric"
            defaultValue=""
            options={[
              { value: "katan", label: "Katan" },
              { value: "jamdani", label: "Jamdani" },
            ]}
          />
          <Textarea label="Delivery note" placeholder="Anything we should know?" />
        </div>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Gift wrap" />
          <Radio name="delivery" label="Inside Dhaka" defaultChecked />
          <Radio name="delivery" label="Outside Dhaka" />
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Soft</Badge>
          <Badge variant="primary">New</Badge>
          <Badge variant="accent">Best seller</Badge>
          <Badge variant="neutral">Sold out</Badge>
        </div>
      </Section>

      <Section title="Prices and dates">
        <PriceTag price={4500} salePrice={3600} />
        <PriceTag price={4500} />
        <p className="text-sm">
          {formatBDT(125000)} on {formatDate("2026-11-04T00:00:00+06:00")}
        </p>
      </Section>

      <Section title="Loading">
        <div className="flex items-center gap-4">
          <Spinner />
          <Skeleton className="h-24 w-24" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </Section>

      <Section title="Empty state">
        <EmptyState
          title="Your cart is empty"
          description="Saved items will show up here."
          action={<Button variant="outline">Browse sarees</Button>}
        />
      </Section>

      <Section title="Modal and drawer">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>
            Open drawer
          </Button>
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Size guide">
          <p>Press Escape, click outside or use the close button.</p>
        </Modal>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Your cart">
          <p>Drawer content goes here.</p>
        </Drawer>
      </Section>
    </Container>
  );
}
