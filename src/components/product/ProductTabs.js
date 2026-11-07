"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { fabricHref, pageHref } from "@/lib/siteConfig";

const TABS = ["Description", "Fabric & care", "Delivery & exchange", "Reviews"];

const HTML_CLASS =
  "text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5";

export default function ProductTabs({ product, deliveryInfoText, returnPolicyText }) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const { description, careInfo, fabric, shortDesc } = product;

  const onKeyDown = (event) => {
    const steps = { ArrowRight: 1, ArrowLeft: -1 };
    if (steps[event.key]) {
      event.preventDefault();
      const next = (active + steps[event.key] + TABS.length) % TABS.length;
      setActive(next);
      listRef.current.children[next].focus();
    }
  };

  const panels = [
    description ? (
      // The API cleans this HTML before sending it.
      <div className={HTML_CLASS} dangerouslySetInnerHTML={{ __html: description }} />
    ) : (
      <p className="text-sm">{shortDesc ?? "Details coming soon."}</p>
    ),
    <div key="care" className="space-y-2 text-sm">
      {fabric && (
        <p>
          Fabric:{" "}
          <Link href={fabricHref(fabric.slug)} className="text-primary underline">
            {fabric.nameEn}
          </Link>
        </p>
      )}
      <p>{careInfo ?? "Care details coming soon."}</p>
    </div>,
    <div key="delivery" className="space-y-2 text-sm">
      <p className="whitespace-pre-line">
        {deliveryInfoText ||
          "Delivery is available across Bangladesh. The charge and time are shown at checkout."}
      </p>
      {returnPolicyText && <p className="whitespace-pre-line">{returnPolicyText}</p>}
      <p>
        Please read our{" "}
        <Link href={pageHref("return-policy")} className="text-primary underline">
          return policy
        </Link>{" "}
        before ordering.
      </p>
    </div>,
    <p key="reviews" className="text-sm">
      Reviews are coming soon.
    </p>,
  ];

  return (
    <section className="mt-10">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Product information"
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border-b border-soft"
      >
        {TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={clsx(
              "min-h-11 shrink-0 border-b-2 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
              index === active ? "border-primary font-semibold text-primary" : "border-transparent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Every panel stays in the HTML, so search engines can read all of it. */}
      {panels.map((panel, index) => (
        <div
          key={TABS[index]}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== active}
          className="py-4"
        >
          {panel}
        </div>
      ))}
    </section>
  );
}
