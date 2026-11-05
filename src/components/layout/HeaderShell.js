"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export default function HeaderShell({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-30 bg-white transition-shadow",
        scrolled ? "shadow-md" : "border-b border-soft"
      )}
    >
      {children}
    </header>
  );
}
