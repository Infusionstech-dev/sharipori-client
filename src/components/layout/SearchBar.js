"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { formatBDT } from "@/lib/format";
import { categoryHref } from "@/lib/siteConfig";
import { useGetSearchSuggestionsQuery } from "@/store/api/searchApi";
import { SearchIcon } from "./icons";

const DEBOUNCE_MS = 300;
const MIN_LENGTH = 2;

const OPTION_CLASS = "flex w-full items-center gap-3 px-3 py-2 text-left text-sm";

export default function SearchBar({ autoFocus = false, onNavigate, onEscape }) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef(null);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmed = text.trim();

  useEffect(() => {
    const timer = setTimeout(() => setQuery(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const canSuggest = query.length >= MIN_LENGTH;
  const { currentData, isError } = useGetSearchSuggestionsQuery(query, { skip: !canSuggest });

  // currentData is empty while new results load, so old results never answer a new search.
  const products = canSuggest ? (currentData?.products ?? []) : [];
  const categories = canSuggest ? (currentData?.categories ?? []) : [];
  const options = [
    ...products.map((item) => ({ key: `p${item.id}`, href: `/product/${item.slug}` })),
    ...categories.map((item) => ({ key: `c${item.id}`, href: categoryHref(item.slug) })),
  ];

  const showPanel = open && trimmed.length >= MIN_LENGTH;
  const isLoading = showPanel && !isError && (query !== trimmed || !currentData);

  const go = (href) => {
    setOpen(false);
    setActiveIndex(-1);
    setText("");
    onNavigate?.();
    router.push(href);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      // A search input clears itself on Escape by default, which would lose the typed text.
      event.preventDefault();
      if (showPanel) {
        setOpen(false);
        setActiveIndex(-1);
      } else {
        onEscape?.();
      }
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (options.length) {
        // -1 means the text box itself, so arrows can return to typing.
        const size = options.length + 1;
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((index) => ((index + 1 + step + size) % size) - 1);
      }
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (activeIndex >= 0 && options[activeIndex]) {
      go(options[activeIndex].href);
    } else if (trimmed) {
      go(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const optionProps = (index) => {
    const active = index === activeIndex;
    return {
      id: `${listId}-${index}`,
      role: "option",
      "aria-selected": active,
      // Keeps focus in the text box until the click has landed.
      onMouseDown: (event) => event.preventDefault(),
      onMouseEnter: () => setActiveIndex(index),
      onClick: () => go(options[index].href),
      className: clsx(OPTION_CLASS, "cursor-pointer", active && "bg-soft"),
    };
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <form role="search" onSubmit={onSubmit}>
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text/50" />
        <input
          type="search"
          role="combobox"
          aria-label="Search products"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder="Search sarees, fabrics, combos"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-11 w-full rounded-lg border border-text/20 bg-bg pl-10 pr-3 text-base outline-none placeholder:text-text/50 focus:border-primary focus:ring-1 focus:ring-primary md:text-sm"
        />
      </form>

      <div
        id={listId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!showPanel}
        className="absolute inset-x-0 top-full z-40 mt-1 max-h-[70dvh] overflow-y-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-text/10"
      >
        {products.length > 0 && (
          <div role="group" aria-label="Products">
            <p className="px-3 py-1 text-xs font-semibold uppercase text-text/60">Products</p>
            {products.map((product, index) => (
              <div key={product.id} {...optionProps(index)}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="size-10 shrink-0 rounded object-cover"
                  />
                ) : (
                  <span className="size-10 shrink-0 rounded bg-soft" />
                )}
                <span className="min-w-0 flex-1 truncate">{product.nameEn}</span>
                <span className="shrink-0 font-medium text-primary">
                  {formatBDT(product.salePrice ?? product.price)}
                </span>
              </div>
            ))}
          </div>
        )}
        {categories.length > 0 && (
          <div role="group" aria-label="Categories">
            <p className="px-3 py-1 text-xs font-semibold uppercase text-text/60">Categories</p>
            {categories.map((category, index) => (
              <div key={category.id} {...optionProps(products.length + index)}>
                <span>{category.nameEn}</span>
                <span className="font-bangla text-xs text-text/60">{category.nameBn}</span>
              </div>
            ))}
          </div>
        )}
        {isLoading && <p className="px-3 py-2 text-sm text-text/60">Searching…</p>}
        {!isLoading && isError && (
          <p className="px-3 py-2 text-sm text-text/60">
            Suggestions are unavailable. Press Enter to search.
          </p>
        )}
        {!isLoading && !isError && !options.length && (
          <p className="px-3 py-2 text-sm text-text/60">No matches. Press Enter to search anyway.</p>
        )}
      </div>
    </div>
  );
}
