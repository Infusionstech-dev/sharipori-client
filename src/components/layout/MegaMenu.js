"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import Container from "@/components/ui/Container";
import { categoryHref, fabricHref } from "@/lib/siteConfig";
import { ChevronDownIcon } from "./icons";

const HOVER_DELAY_MS = 120;
const PROMO_SLUG = "combo-packages";

const PANEL_LINK_CLASS =
  "block rounded px-2 py-1.5 hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

function PanelHeading({ children }) {
  return <p className="mb-2 px-2 text-xs font-semibold uppercase text-text/60">{children}</p>;
}

function NameLink({ href, nameEn, nameBn, onClick }) {
  return (
    <Link href={href} onClick={onClick} className={PANEL_LINK_CLASS}>
      <span className="block text-sm font-medium">{nameEn}</span>
      {nameBn && <span className="block font-bangla text-xs text-text/60">{nameBn}</span>}
    </Link>
  );
}

export default function MegaMenu({ categories, fabrics }) {
  const [openSlug, setOpenSlug] = useState(null);
  const timerRef = useRef(null);
  const navRef = useRef(null);
  const promo = categories.find((category) => category.slug === PROMO_SLUG);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const openLater = (slug) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpenSlug(slug), HOVER_DELAY_MS);
  };

  const close = () => {
    clearTimeout(timerRef.current);
    setOpenSlug(null);
  };

  const onKeyDown = (event, slug) => {
    if (event.key === "Escape" && openSlug) {
      close();
      navRef.current?.querySelector(`[data-toggle="${slug}"]`)?.focus();
    }
  };

  // ArrowDown on a category opens its panel and moves into it.
  const onLinkKeyDown = (event, slug) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      clearTimeout(timerRef.current);
      setOpenSlug(slug);
      requestAnimationFrame(() =>
        navRef.current?.querySelector(`[data-panel="${slug}"] a`)?.focus()
      );
    }
  };

  return (
    <nav
      ref={navRef}
      aria-label="Categories"
      onMouseLeave={close}
      className="relative z-20 hidden h-14 border-b border-soft bg-white md:block"
    >
      <Container className="h-full">
        <ul className="flex h-full items-stretch justify-between lg:justify-start lg:gap-6">
          {categories.map((category) => {
            const isOpen = openSlug === category.slug;
            return (
              <li
                key={category.id}
                className="flex items-center"
                onMouseEnter={() => openLater(category.slug)}
                onKeyDown={(event) => onKeyDown(event, category.slug)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenSlug((slug) => (slug === category.slug ? null : slug));
                  }
                }}
              >
                <Link
                  href={categoryHref(category.slug)}
                  onClick={close}
                  onKeyDown={(event) => onLinkKeyDown(event, category.slug)}
                  className={clsx(
                    "rounded px-1 py-1 text-center hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isOpen && "text-primary"
                  )}
                >
                  <span className="block text-sm font-medium leading-tight">{category.nameEn}</span>
                  <span className="block font-bangla text-xs leading-tight text-text/60">
                    {category.nameBn}
                  </span>
                </Link>
                <button
                  type="button"
                  data-toggle={category.slug}
                  aria-label={`${category.nameEn} menu`}
                  aria-expanded={isOpen}
                  onClick={() => setOpenSlug(isOpen ? null : category.slug)}
                  className="rounded p-1 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronDownIcon
                    className={clsx("size-4 transition-transform", isOpen && "rotate-180")}
                  />
                </button>

                <div
                  data-panel={category.slug}
                  hidden={!isOpen}
                  className="absolute inset-x-0 top-full border-t border-soft bg-white shadow-lg"
                >
                  <Container className="grid grid-cols-3 gap-8 py-6">
                    <div>
                      <PanelHeading>{category.nameEn}</PanelHeading>
                      {category.children.map((child) => (
                        <NameLink
                          key={child.id}
                          href={categoryHref(child.slug)}
                          nameEn={child.nameEn}
                          nameBn={child.nameBn}
                          onClick={close}
                        />
                      ))}
                      <NameLink
                        href={categoryHref(category.slug)}
                        nameEn={`Shop all ${category.nameEn}`}
                        onClick={close}
                      />
                    </div>
                    <div>
                      <PanelHeading>Shop by fabric</PanelHeading>
                      <div className="grid grid-cols-2">
                        {fabrics.map((fabric) => (
                          <NameLink
                            key={fabric.id}
                            href={fabricHref(fabric.slug)}
                            nameEn={fabric.nameEn}
                            nameBn={fabric.nameBn}
                            onClick={close}
                          />
                        ))}
                      </div>
                    </div>
                    {promo && (
                      <Link
                        href={categoryHref(promo.slug)}
                        onClick={close}
                        className="relative flex min-h-40 flex-col justify-end overflow-hidden rounded-lg bg-primary p-4 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        {promo.image && (
                          <Image
                            src={promo.image}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover opacity-50"
                          />
                        )}
                        <span className="relative font-display text-xl">{promo.nameEn}</span>
                        <span className="relative text-sm text-accent">Shop matching sets</span>
                      </Link>
                    )}
                  </Container>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
