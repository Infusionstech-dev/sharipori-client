"use client";

import { useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "./icons";
import SearchBar from "./SearchBar";

const BUTTON_CLASS =
  "flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function MobileSearch() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const close = () => {
    setOpen(false);
    // The button is back on screen only after the next render.
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className={BUTTON_CLASS}
      >
        <SearchIcon />
      </button>
      {open && (
        <div className="absolute inset-0 z-10 flex items-center gap-1 bg-white px-2">
          <SearchBar autoFocus onNavigate={() => setOpen(false)} onEscape={close} />
          <button type="button" aria-label="Close search" onClick={close} className={BUTTON_CLASS}>
            <CloseIcon />
          </button>
        </div>
      )}
    </>
  );
}
